# Mobile development guide

## Where to change things

- Add a feature under `src/features/<feature>`; keep screens, API functions, types, and stores beside that feature. Create subfolders only when needed.
- Keep app-level navigation in `src/app/navigation`. Update `types.ts` when adding stack parameters and `MainTabs.tsx` for new tabs.
- Promote a component to `src/shared` when more than one feature needs it. Avoid importing screens from other features.
- Theme colors belong in `src/shared/theme/theme.ts`. Use `useTheme`; preserve light and dark contrast.
- Keep network calls in API files. Screen state handles loading, retry, and empty results separately. Auth uses its own client; do not import the authenticated client into the auth store.
- The shared authenticated HTTP client is the intentional exception to the shared-to-feature boundary: it accesses the auth store for token attachment and expiry handling.
- Progress consumes the practice attempts API; history and dashboard are two views of the same persisted data.

## Working safely

Use the lockfile with `npm ci`. For Expo packages, use `npx expo install <package>` to select an SDK-compatible version. Do not upgrade Expo or React Native as part of an unrelated UI change.

Run `npm run format` and `npm run check` before committing. Tests load real TypeScript through platform adapters; if moving a file, update its test loader path and import mocks too. Test behavior rather than copying implementation details.

## Manual release check

1. Register with and without a photo, log out, and log back in. Check session restoration after restarting the app.
2. Change/remove the profile photo; confirm Home and Account tab avatars agree.
3. Choose a topic/level; leave and return. Generate one question, submit an answer, and repeat from feedback. Back navigation should not accumulate old answer screens.
4. Check history and progress refresh after submission. Disconnect networking and verify recoverable errors.
5. Restore a mentor conversation. Verify failed sends retain a draft and do not invent an assistant reply.
6. Inspect light/dark modes, keyboard layouts, large text, and a small display. Check tab labels and Reduce Motion.

Live question generation, evaluation, and chat can use Gemini quota. Automated tests do not.

## Known boundaries

No offline database or background synchronization. Practice preferences are session-only. Photo cropping is automatic and centered. CI does not currently run native UI tests. The legacy FRONTEND_REVIEW.md, if present locally, is a historical audit rather than the current handoff guide.
