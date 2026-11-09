// Source-level regressions with platform adapters; native layout is tested on device.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const tick = () => new Promise((resolve) => setImmediate(resolve));
const jsx = (type, props) => ({ type, props });
function load(file, mocks) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(id) {
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (id in mocks) return mocks[id];
      throw Error('Unmocked import: ' + id);
    },
  });
  return exports;
}
const native = {
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'Button',
  ScrollView: 'ScrollView',
  StyleSheet: { create: (s) => s },
};
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
}

test('feedback actions return to existing routes across repeated practice cycles', async () => {
  const { StackRouter, CommonActions, StackActions } = await import('@react-navigation/routers');
  const router = StackRouter({});
  const options = {
    routeNames: ['Tabs', 'QuestionSetup', 'QuestionDisplay', 'FeedbackScreen'],
    routeParamList: {},
    routeGetIdList: {},
  };
  let state = router.getInitialState(options);
  const dispatch = (action) => {
    state = router.getStateForAction(state, action, options);
  };
  const component = load('src/features/practice/screens/FeedbackScreen.tsx', {
    'react-native': native,
    'react-native-safe-area-context': { SafeAreaView: 'SafeAreaView' },
    '@react-navigation/native': {
      useRoute: () => ({ params: { attempt: { aiScore: 90, aiFeedback: 'Good' } } }),
      useNavigation: () => ({
        popTo: (name, params) => dispatch(StackActions.popTo(name, params)),
      }),
    },
    '../../../shared/hooks/useTheme': { useTheme: () => ({}) },
  }).default;
  for (let cycle = 0; cycle < 3; cycle++) {
    dispatch(CommonActions.navigate('QuestionSetup'));
    dispatch(CommonActions.navigate('QuestionDisplay'));
    dispatch(StackActions.replace('FeedbackScreen'));
    const buttons = nodes(component()).filter((node) => node.type === 'Button');
    if (cycle < 2) {
      buttons[0].props.onPress();
      assert.deepEqual(
        state.routes.map((r) => r.name),
        ['Tabs', 'QuestionSetup'],
      );
    } else {
      buttons[1].props.onPress();
      assert.deepEqual(
        state.routes.map((r) => r.name),
        ['Tabs'],
      );
      assert.equal(state.routes[0].params.screen, 'Home');
    }
  }
});

test('focused resources refresh and discard responses after leaving a screen', async () => {
  const values = [];
  let index = 0,
    focus,
    resolveOld;
  const react = {
    useState(initial) {
      const i = index++;
      if (!(i in values)) values[i] = initial;
      return [values[i], (v) => (values[i] = typeof v === 'function' ? v(values[i]) : v)];
    },
    useCallback: (fn) => fn,
  };
  const { useFocusedResource } = load('src/shared/hooks/useFocusedResource.ts', {
    react,
    '@react-navigation/native': { useFocusEffect: (fn) => (focus = fn) },
  });
  let call = 0;
  const fetch = () =>
    ++call === 1 ? new Promise((r) => (resolveOld = r)) : Promise.resolve(['new attempt']);
  const render = () => {
    index = 0;
    return useFocusedResource(fetch);
  };
  render();
  const leave = focus();
  leave();
  render();
  focus();
  await tick();
  assert.deepEqual(render().data, ['new attempt']);
  resolveOld(['stale attempt']);
  await tick();
  assert.deepEqual(render().data, ['new attempt']);
});

test('failed resource requests expose an error instead of empty success', async () => {
  const values = [];
  let index = 0,
    focus;
  const { useFocusedResource } = load('src/shared/hooks/useFocusedResource.ts', {
    react: {
      useState(initial) {
        const i = index++;
        if (!(i in values)) values[i] = initial;
        return [values[i], (v) => (values[i] = typeof v === 'function' ? v(values[i]) : v)];
      },
      useCallback: (fn) => fn,
    },
    '@react-navigation/native': { useFocusEffect: (fn) => (focus = fn) },
  });
  const fetch = async () => {
    throw Error('offline');
  };
  useFocusedResource(fetch);
  focus();
  await tick();
  index = 0;
  const state = useFocusedResource(fetch);
  assert.equal(state.error, true);
  assert.equal(state.isLoading, false);
  assert.equal(state.data, undefined);
});

test('logout waits for durable deletion and keeps the session on deletion failure', async () => {
  let complete;
  const state = load('src/features/auth/store/authStore.ts', {
    zustand: {
      create: (fn) => {
        let s;
        s = fn((update) => Object.assign(s, update));
        return s;
      },
    },
    'expo-secure-store': { deleteItemAsync: () => new Promise((resolve) => (complete = resolve)) },
    '../api/authApi': {},
  }).useAuthStore;
  state.setToken('test-session');
  let finished = false;
  const logout = state.logout().then(() => (finished = true));
  await tick();
  assert.equal(finished, false);
  assert.equal(state.token, 'test-session');
  complete();
  await logout;
  assert.equal(state.token, null);
  const failing = load('src/features/auth/store/authStore.ts', {
    zustand: {
      create: (fn) => {
        let s;
        s = fn((update) => Object.assign(s, update));
        return s;
      },
    },
    'expo-secure-store': {
      deleteItemAsync: async () => {
        throw Error('storage');
      },
    },
    '../api/authApi': {},
  }).useAuthStore;
  failing.setToken('test-session');
  await assert.rejects(failing.logout(), /storage/);
  assert.equal(failing.token, 'test-session');
});

test('greeting rotates on successful login, survives logout, and stays stable on profile refresh', async () => {
  const saved = { sessionGreeting: 'champ' };
  const store = load('src/features/auth/store/authStore.ts', {
    zustand: {
      create: (fn) => {
        let state;
        state = fn(
          (update) => Object.assign(state, update),
          () => state,
        );
        return state;
      },
    },
    'expo-secure-store': {
      getItemAsync: async (key) => saved[key] ?? null,
      setItemAsync: async (key, value) => {
        saved[key] = value;
      },
      deleteItemAsync: async (key) => {
        delete saved[key];
      },
    },
    '../api/authApi': {
      loginRequest: async () => ({ token: 'token', user: { id: '1', name: 'admin' } }),
      profileRequest: async () => ({ id: '1', name: 'admin' }),
    },
  }).useAuthStore;
  await store.login({});
  const first = store.greeting;
  assert.notEqual(first, 'champ');
  await store.refreshProfile();
  assert.equal(store.greeting, first);
  await store.logout();
  assert.equal(saved.sessionGreeting, first);
  await store.login({});
  assert.notEqual(store.greeting, first);
  assert.equal(saved.sessionGreeting, store.greeting);
  store.setGreeting(saved.sessionGreeting);
  assert.equal(store.greeting, saved.sessionGreeting);
});

test('Predict output opens a local challenge without requesting an AI question', async () => {
  let apiCalls = 0;
  const navigations = [];
  const screen = load('src/features/practice/screens/QuestionSetupScreen.tsx', {
    react: { useState: (value) => [value, () => {}], useRef: (value) => ({ current: value }) },
    'react-native': {
      ...native,
      ActivityIndicator: 'Spinner',
      useWindowDimensions: () => ({ width: 400, fontScale: 1 }),
    },
    '@expo/vector-icons': { Ionicons: 'Icon' },
    '@react-navigation/native': {
      useNavigation: () => ({
        navigate: (...args) => navigations.push(args),
        isFocused: () => true,
      }),
    },
    'react-native-safe-area-context': { SafeAreaView: 'SafeAreaView' },
    '../../../shared/api/apiError': {},
    '../../../shared/components/AiErrorNotice': {},
    '../api/questionApi': {
      generateQuestionRequest: async () => {
        apiCalls++;
      },
    },
    '../../../shared/hooks/useTheme': { useTheme: () => ({}) },
    '../store/practicePreferences': {
      usePracticePreferences: () => ({
        category: 'Predict output',
        difficulty: 'Easy',
        setCategory() {},
        setDifficulty() {},
      }),
    },
  }).default;
  const buttons = nodes(screen()).filter((node) => node.type === 'Button');
  await buttons.at(-1).props.onPress();
  assert.equal(apiCalls, 0);
  assert.equal(navigations[0][0], 'OutputChallenge');
  assert.equal(navigations[0][1].difficulty, 'Easy');
});

test('AI error messages distinguish rate limits, timeouts, and offline failures', () => {
  const { aiErrorMessage } = load('src/shared/api/apiError.ts', {
    axios: require('axios'),
  });
  const { AxiosError } = require('axios');
  const fallback = 'Could not get feedback.';
  assert.match(
    aiErrorMessage(
      new AxiosError('quota', undefined, undefined, undefined, { status: 429 }),
      fallback,
    ),
    /limit was reached/,
  );
  assert.match(aiErrorMessage(new AxiosError('timeout', 'ECONNABORTED'), fallback), /timed out/);
  assert.match(
    aiErrorMessage(new AxiosError('network', 'ERR_NETWORK'), fallback),
    /Check your connection/,
  );
  assert.equal(aiErrorMessage(new Error('unexpected'), fallback), fallback);
});
