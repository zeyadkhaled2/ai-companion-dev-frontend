# DevReps

DevReps is a React Native app for practicing technical interviews and understanding how code runs. You can answer a question and get feedback, predict the output of a JavaScript snippet, or step through a data structure one move at a time.

## What you can do

- **Practice interviews.** Pick React, Node, JavaScript, SQL, or HR. Choose a difficulty, submit an answer, and review your score and feedback in History.
- **Predict JavaScript output.** Choose an answer, then follow the code line by line to see why it behaves that way.
- **Explore the Data Structures Lab.** Use visual lessons and games to learn concepts such as queues, recursion, and tree traversal.
- **Ask the Mentor.** Get help with a coding question and return to your saved conversation later.
- **Track progress.** See your practice results, current streak, and personal best. You can also add an optional profile photo.

## Run it locally

You’ll need **Node 24**, an Expo SDK 58-compatible client, and the [DevReps API](https://github.com/zeyadkhaled2/devreps-api) running. Follow the API README first to set up PostgreSQL and Gemini.

```sh
npm ci
```

Copy `.env.example` to `.env.local`. Set `EXPO_PUBLIC_API_URL` to the address your device can reach. The URL should end in `/api`.

- **Android emulator** → `http://10.0.2.2:3000/api`
- **iOS simulator** → `http://localhost:3000/api` when the simulator and API run on the same Mac
- **Physical phone** → use your computer’s local IP, such as `http://192.168.1.10:3000/api`. Keep the phone and computer on the same network.

```sh
npm start
```

Open the project from Expo on your phone or select an emulator. Use `npm run android` or `npm run ios` to target a simulator directly. Restart Expo after changing `.env.local`. A hosted API should use HTTPS.

## How it fits together

The app uses **Expo SDK 58, React Native, and TypeScript**. Screens and their logic live in `src/features/`, navigation lives in `src/app/navigation/`, and shared UI and API code live in `src/shared/`.

The API stores accounts, photos, interview attempts, Mentor conversations, and streaks in PostgreSQL. Expo SecureStore keeps your session token and your JavaScript puzzle results on the device. Puzzle results are tied to your account on that device. The JavaScript puzzles and labs ship with the app and use zero Gemini requests. Keep Gemini keys and database credentials in the API environment.

## Checks

Run `npm run check` for formatting, TypeScript, and regression tests. GitHub Actions runs the same checks on pushes and pull requests. The [development guide](docs/DEVELOPMENT.md) covers the folder layout and checks to run on a device.
