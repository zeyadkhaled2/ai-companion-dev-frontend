# AI Developer Companion — Mobile App

A React Native (Expo) mobile app that helps developers prepare for technical interviews — practice AI-generated questions, get instant AI feedback, track progress over time, and chat with an AI interview mentor.

Built as a full-stack portfolio project, paired with a [Node/Express/PostgreSQL backend](<link to backend repo>).

## Features

- 🔐 Secure auth (JWT, encrypted on-device token storage)
- 🎯 Pick a category and difficulty, get an AI-generated interview question
- ✍️ Submit answers and receive AI-scored feedback (0–100) with actionable suggestions
- 📊 A progress dashboard with score-trend and category-performance charts
- 🕓 Full history of past practice attempts
- 💬 An AI chat mentor for open-ended interview prep questions, with persisted conversation memory
- 🌗 Full dark mode support, following the system theme
- 📱 Custom floating tab bar with a native, minimal design language

## Tech Stack

- **Framework:** React Native (Expo), TypeScript
- **Navigation:** React Navigation (native stack + bottom tabs, nested navigators)
- **State:** Zustand (client state), TanStack Query patterns for server state
- **Forms:** React Hook Form + Zod validation
- **Networking:** Axios, with interceptors for automatic JWT attachment and session-expiry handling
- **Charts:** react-native-gifted-charts
- **Storage:** expo-secure-store (encrypted token storage)

## Screens

| Screen | Description |
|---|---|
| Login / Register | Validated auth forms |
| Home | Primary entry point — start a new practice question |
| Question Setup → Display → Feedback | Core practice loop: pick category/difficulty → answer → get AI feedback |
| History | List of past attempts with scores |
| Dashboard | Analytics — score trend and category performance charts |
| Chat | Multi-turn AI mentor chat |
| Account | Profile info, logout |

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npx expo`)
- The [backend API](<link to backend repo>) running locally or deployed
- Expo Go app (for testing on a physical device) or an Android/iOS emulator

### Setup

```bash
git clone <this-repo-url>
cd ai-dev-companion-mobile
npm install
```

Update the API base URL in `src/services/apiClient.ts` to point to your running backend:
```typescript
const API_BASE_URL = 'http://<your-local-ip>:3000/api';
```
> Note: `10.0.2.2` works for the Android emulator; a physical device needs your machine's actual local network IP, with both devices on the same Wi-Fi network.

Start the dev server:
```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` / `i` to launch on an emulator/simulator.

## Architecture Notes

- **Nested navigators** — a bottom tab navigator (Home, History, Dashboard, Chat, Account) is nested inside a top-level stack navigator, which handles the focused Question → Feedback flow outside the tab bar.
- **Centralized theming** — a single `theme.ts` defines light/dark color tokens consumed via a `useTheme()` hook across every screen, rather than hardcoded colors, enabling full dark mode support with `useColorScheme()`.
- **Axios interceptors** — a request interceptor automatically attaches the JWT to every API call from the Zustand auth store; a response interceptor detects expired/invalid tokens (401) and automatically logs the user out, redirecting to the login screen.

## Related Repo

The backend API for this project lives at: `<link to backend repo>`
