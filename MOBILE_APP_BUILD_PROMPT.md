# Expo Mobile App Build Prompt

Copy the prompt below into your VS Code coding agent.

```text
I want to add a mobile app to this existing net-worth project.

Project context:
- The existing frontend uses Vue.js.
- The backend is a Node.js/Express API written in JavaScript.
- PostgreSQL is the database.
- There is currently no authentication because this is a personal-use application.
- Monthly net worth is calculated from balances entered for every active account.
- The existing web dashboard has a button that lets me enter those monthly account balances.
- During development, the API runs on my computer.
- The backend currently runs inside WSL on Windows.
- Later, the API and PostgreSQL database will be hosted on a DigitalOcean droplet.
- I will initially test on a physical Android phone using Expo Go.
- I want the code to remain compatible with iOS, although Android is the immediate target.
- I am comfortable with React, but I am new to React Native and Expo.
- This does not need to be app-store ready.
- Authentication is intentionally out of scope for this local-development milestone for both
  the existing web app and the mobile app. Authentication must be added before the API is
  exposed publicly on DigitalOcean.

Goal:
Create a new Expo and React Native mobile client that reuses the existing Express API. Do not replace or rewrite the Vue frontend.

Behavioral parity requirement:
- The mobile app must operate the same way as the existing web app.
- Treat the Vue frontend and existing backend behavior as the source of truth for calculations,
  validation, account filtering, month selection, blank values, saving, and error handling.
- Reproduce the web dashboard's data, calculations, and supported workflows in a layout suited
  to a phone. Do not invent different business rules for mobile.
- In particular, preserve the existing monthly-balance behavior: blank balances may be left
  blank and are omitted from submission; saving uses the existing API behavior; loading current
  or historical months must follow the web app and API behavior exactly.
- Preserve the web dashboard's definition of current net worth, including its use of the latest
  available balance for each active account.

The first mobile version should support:
1. A basic net-worth dashboard/summary.
2. Displaying the latest monthly net worth.
3. Displaying whatever useful account or historical summary the existing API already supports.
4. Starting a new monthly balance entry.
5. Loading all active accounts.
6. Entering a balance for each active account.
7. Submitting the monthly balances through the existing API.
8. Showing clear loading, empty, success, validation, and error states.

Before changing code:
1. Inspect the complete repository structure.
2. Read the backend routes, controllers, database access code, and schema/migrations.
3. Read the Vue implementation of the dashboard and monthly balance workflow.
4. Identify the exact API endpoints and request/response formats already used by Vue.
5. Look for repository instructions such as AGENTS.md, README files, and environment examples.
6. Summarize your findings and propose a short implementation plan.
7. Provide a prerequisite and installation checklist before installing or scaffolding anything.
   Explain in beginner-friendly language what each required tool is for, whether it is already
   installed, and the exact command or action needed if it is missing. Include Node.js/npm,
   Expo tooling, Expo Go on Android, and any other required dependency.
8. Do not install global packages unless they are genuinely required; prefer project-local tools
   invoked with `npx` when recommended by Expo.
9. Preserve all existing behavior and unrelated user changes.
10. If an API endpoint needed by the mobile app does not exist, explain what is missing before adding it. Prefer reusing existing endpoints.

Implementation requirements:
- Create the mobile app in a new `mobile` directory inside this repository unless the repository structure indicates a clearly better location.
- Use the current recommended Expo setup.
- Use React Native with TypeScript.
- Use Expo Router for navigation.
- Keep the first version simple and maintainable.
- Do not use web-only HTML elements or browser APIs.
- Do not duplicate backend business logic in the mobile app.
- Create a small API client module so screens do not call `fetch` directly everywhere.
- Define TypeScript types for the API data used by the mobile app.
- Put the API base URL in Expo environment configuration, such as `EXPO_PUBLIC_API_URL`.
- Add a `mobile/.env.example` containing a safe example, but do not commit secrets.
- Never connect the mobile app directly to PostgreSQL.
- Do not hardcode my computer’s IP address in source code.
- Add sensible client-side validation for monthly balances.
- Use React Native components and styling that work on both Android and iOS.
- Prefer Expo-compatible packages and avoid unnecessary dependencies.
- Do not add authentication yet.
- Do not modify the Vue frontend unless a shared API defect requires a narrowly scoped fix.
- Do not deploy or make app-store configuration part of this milestone.

Local-device networking:
- A physical phone cannot reach the computer’s API through `localhost`.
- Development runs in WSL on Windows. Inspect the actual WSL/Windows networking setup and give
  instructions appropriate to it rather than assuming the phone can directly reach WSL.
- Check how the Express server currently binds to the network.
- Make the smallest safe development change needed so Express can listen on `0.0.0.0` while retaining its configurable port.
- Check whether CORS configuration permits requests from the mobile development client.
- Do not expose PostgreSQL to the phone or local network.
- Explain how I can find my computer’s LAN IP address.
- Explain which address the phone should use and, if necessary, how Windows-to-WSL forwarding,
  mirrored networking, and Windows Firewall affect access. Start with the smallest safe setup
  and only introduce port forwarding if the current WSL configuration requires it.
- Configure the mobile app through `.env` to use a URL shaped like:
  `http://192.168.x.x:<api-port>`
- Explain that the computer and Android phone should normally be on the same Wi-Fi network.
- Mention firewall access if the phone cannot reach the API.
- Keep the API URL configurable so it can later be changed to an HTTPS DigitalOcean domain.
- Do not add authentication in this milestone. Clearly document that the unauthenticated API
  must not be exposed publicly and that authentication will be added before DigitalOcean deployment.

Suggested screens:
- Dashboard screen
- New Monthly Balances screen

For the monthly balance form:
- Fetch active accounts from the existing API.
- Render an appropriate numeric/currency input for each account.
- Keep the form usable when the keyboard is open.
- Validate required or invalid values based on existing web-app behavior.
- Prevent accidental duplicate submissions.
- Submit data in exactly the format expected by the existing API.
- After success, return to or refresh the dashboard so the new net worth is visible.

Learning requirement:
I am new to mobile development. As you work, briefly explain mobile-specific concepts such as:
- Expo
- Expo Go
- React Native components
- Expo Router
- physical-device networking
- environment variables
- Android keyboard and scrolling behavior
- what must be installed, where it is installed (Windows, WSL, the project, or the phone), and why

Do not over-engineer the app. Do not introduce Redux unless the current requirements genuinely need it.

Verification:
- Check for existing tests before making changes. The backend currently has no implemented test
  suite (`npm test` is a placeholder that exits with an error), so report that clearly rather
  than presenting the expected placeholder failure as a regression. If backend behavior must
  change, add and run focused tests for that change.
- Run TypeScript checking and linting for the mobile app.
- Start the Expo development server and report any issues.
- If physical-device testing requires me to take an action, stop and give me exact instructions.
- Do not claim that physical-device behavior was verified unless I actually confirm it.

Documentation:
Update or create a mobile README with exact commands for:
1. Installing dependencies.
2. Creating the local `.env`.
3. Finding and setting the computer’s LAN IP.
4. Starting the Express API.
5. Starting Expo.
6. Opening the app through Expo Go on Android.
7. Troubleshooting LAN, firewall, CORS, and cleartext HTTP issues.
8. Later switching the API URL to an HTTPS DigitalOcean deployment.

Work incrementally:
Phase 1: inspect the repository, check prerequisites, explain what needs to be installed, and present the plan. Do not install anything yet.
Phase 2: scaffold the Expo app and confirm it starts.
Phase 3: add the API client and dashboard.
Phase 4: add the monthly balances workflow.
Phase 5: verify and document everything.

Start with Phase 1. Do not begin implementation until you have shown me what you found and the proposed file-level plan.
```

After the coding agent presents its findings and plan, continue with:

```text
Proceed with Phase 2.
```
