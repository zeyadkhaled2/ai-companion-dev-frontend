# AI Developer Companion Mobile

Expo SDK 58 / React Native 0.88 app for technical interview practice. Includes ivory/teal and charcoal themes, practice feedback, progress charts, saved mentor conversations, and optional profile photos.

## Run locally

Use Node 24 (also used by CI).

1. Start the [backend](https://github.com/zeyadkhaled2/ai-companion-dev-backend).
2. Run `npm ci`.
3. Copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_API_URL` including `/api`.
4. Run `npm start`. Use a compatible Expo Go client, Android emulator, or development build.

Android emulator default: `http://10.0.2.2:3000/api`. iOS simulator default: `http://localhost:3000/api`. For an iPhone or physical Android device, use the development computer's LAN IP and connect both devices to the same network. Use HTTPS for a hosted demo. Restart Expo after changing environment settings.

Only the API URL belongs in client configuration. Gemini keys, database credentials, and JWT signing secrets belong in the backend. `EXPO_PUBLIC_*` values are visible in the shipped app.

## Project map

```text
App.tsx                      Safe-area provider and root navigation
src/
  app/navigation/            Auth/app stacks, typed routes, animated tabs
  features/
    auth/                    Login/register screens, auth API/store/schemas
    account/                 Profile and logout screen
    home/                    Practice entry point
    practice/                Setup, answer, feedback, APIs/types/preferences
    output/                  Curated JavaScript output puzzles and execution traces
    progress/                History and dashboard screens, stats types
    chat/                    Mentor screen, API and message types
  shared/
    api/                     Axios client, URL configuration, error messages
    components/              Avatar, photo picker, loading/error UI
    hooks/                   Theme and focus-aware resource loading
    theme/                   Light/dark design tokens
tests/                       Regression tests with native adapters
docs/DEVELOPMENT.md           Extension guide and device checklist
```

## Behavior and data

- PostgreSQL stores accounts, profile photos, attempts, and conversations through the API.
- SecureStore stores the token and session greeting. Greetings rotate after successful login and remain stable during a session.
- Zustand stores current auth/profile state and practice selections. Practice choices survive navigation, but reset when the app process restarts.
- `useFocusedResource` reloads history and progress on focus and discards stale results. The app does not currently use TanStack Query for fetching.
- Auth requests use an independent Axios client to avoid a store/interceptor dependency cycle. The shared authenticated client reads the token and clears matching expired sessions.
- Photo selection center-crops and resizes to a 256px JPEG. The API accepts at most 300 KB; photos are stored in the user record. Object storage is a future scaling option.
- Navigation labels remain visible; selection animation respects Reduce Motion. Practice setup scrolls only when content exceeds the available height, including enlarged accessibility text.

## Checks

- `npm run check`: formatting, TypeScript, and regression tests.
- `npm run format`: format maintained source and tests.
- `npm run android` / `npm run ios`: start Expo for the target platform.

CI runs formatting, TypeScript and tests on pushes and pull requests. Tests cover navigation restoration, focus-loading races/errors, durable logout, and greeting rotation. They make no Gemini calls. Device checks are listed in `docs/DEVELOPMENT.md`.

After large file moves, restart Metro with `npx expo start --clear` if its cache still references an old path.

## Predict the output

The sixth practice topic is a separate, quota-free JavaScript mode. It includes nine curated puzzles across Easy, Medium, and Hard. Answer choices and execution traces are shipped with the app; no code is evaluated on the device and no Gemini request is made. The Node tests execute only trusted challenge fixtures to verify answers and trace output.

Progress stores the last selected answer per challenge in SecureStore, scoped to the signed-in account on this device. Missed/unseen challenges are prioritized in the next session. Results are separate from AI interview scores and do not sync to the backend.

To add a puzzle, edit `src/features/output/data/challenges.ts`, provide three distinct options and numbered trace steps, and run `npm run check`. Keep examples deterministic and limited to portable JavaScript behavior.
