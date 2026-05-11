# DIMS Mobile — DigiMark Internship Management System

> A React Native (Expo) mobile application built for interns at **DigiMark Consulting**. Interns can manage their tasks, track attendance, view their timetable, check notifications, and manage their profile — all in one place.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Prerequisites](#3-prerequisites)
4. [Getting Started](#4-getting-started)
5. [Environment Variables](#5-environment-variables)
6. [Project Structure](#6-project-structure)
7. [Navigation & Routing](#7-navigation--routing)
8. [State Management (Zustand Stores)](#8-state-management-zustand-stores)
9. [API Layer](#9-api-layer)
10. [Screens Reference](#10-screens-reference)
11. [Components Reference](#11-components-reference)
12. [Types](#12-types)
13. [Utilities](#13-utilities)
14. [Constants & Theme](#14-constants--theme)
15. [Authentication Flow](#15-authentication-flow)
16. [Local Storage Strategy](#16-local-storage-strategy)
17. [Adding New Features — A Checklist](#17-adding-new-features--a-checklist)
18. [Running & Building the App](#18-running--building-the-app)
19. [Code Style & Conventions](#19-code-style--conventions)

---

## 1. Project Overview

DIMS Mobile is the **intern-facing** mobile client for the DigiMark Internship Management System. It connects to two separate backend services:

| Service | Purpose |
|---|---|
| **Auth API** (`AUTH_BASE_URL`) | Handles login, signup, password reset, and email verification |
| **DIMS API** (`API_BASE_URL`) | Handles all business data — tasks, attendance, timetables, notifications, profiles |

The app is designed for **interns only**. All screens and data are scoped to the logged-in intern's profile.

---

## 2. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.81.5 | Core mobile framework |
| Expo | ~54.0.33 | Build toolchain & native APIs |
| Expo Router | ~6.0.23 | File-based navigation |
| TypeScript | ~5.9.2 | Type safety |
| Zustand | ^5.0.12 | Global state management |
| Axios | ^1.15.2 | HTTP client |
| AsyncStorage | 2.2.0 | Persistent local storage |
| React Navigation | ^7.x | Tab & stack navigation primitives |
| date-fns | ^4.1.0 | Date formatting utilities |
| expo-linear-gradient | ^55.0.13 | Gradient UI effects |

---

## 3. Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Expo CLI** — `npm install -g expo-cli`
- **Expo Go** app on your physical device (iOS or Android), **OR** an Android/iOS emulator/simulator
- Access to the DigiMark backend services (ask a team lead for API URLs)

---

## 4. Getting Started

### Step 1 — Clone the repository

```bash
git clone <repository-url>
cd dims
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure environment variables

Create a `.env` file in the project root (see [Section 5](#5-environment-variables) for details):

```bash
cp .env.example .env   # if an example exists, otherwise create manually
```

### Step 4 — Start the development server

```bash
npm start
# or
npx expo start
```

Then:
- Press **`a`** to open on an Android emulator
- Press **`i`** to open on an iOS simulator
- Scan the **QR code** with the Expo Go app on your physical device

---

## 5. Environment Variables

All environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible inside the app bundle.

Create a `.env` file in the project root with the following:

```env
# ─── Auth Service ──────────────────────────────────────────────────────────
# Use the local auth server during development:
EXPO_PUBLIC_AUTH_BASE_URL=http://localhost:3001/api/auth

# Use the production auth server when testing against staging/prod:
# EXPO_PUBLIC_AUTH_BASE_URL=https://auth.digimarkconsulting.cm/api/auth/

# ─── DIMS Data API ─────────────────────────────────────────────────────────
# Use production API (currently active):
EXPO_PUBLIC_API_BASE_URL=https://api.digimarkconsulting.cm/api/v1

# Use local API during development:
# EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

> **Important:** Never commit the `.env` file to Git. It is already listed in `.gitignore`.  
> Ask a team lead for the correct production values if they are not in the repo.

---

## 6. Project Structure

```
dims/
├── app/                    # All screens and routing (Expo Router)
│   ├── _layout.tsx         # Root layout — loads session on startup
│   ├── index.tsx           # Entry point — redirects to login
│   ├── (auth)/             # Unauthenticated screens
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   ├── verify-code.tsx
│   │   └── reset-password.tsx
│   └── (app)/              # Authenticated screens (tab + stack)
│       ├── _layout.tsx     # Tab bar layout
│       ├── dashboard.tsx
│       ├── tasks.tsx
│       ├── task-detail.tsx
│       ├── attendance.tsx
│       ├── timetable.tsx
│       ├── notifications.tsx
│       ├── progress.tsx
│       ├── permissions.tsx
│       ├── request-permission.tsx
│       ├── payment.tsx
│       ├── tools.tsx
│       └── profile.tsx
│
├── components/             # Reusable UI components
│   ├── common/             # Generic app-wide components
│   ├── cards/              # Domain-specific card components
│   ├── layout/             # Navigation & layout components
│   └── ui/                 # Low-level utility UI pieces
│
├── constants/              # App-wide constants
│   ├── api.ts              # All API endpoint definitions
│   └── theme.ts            # Colors, fonts, spacing, radii
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useAttendance.ts
│   ├── useTasks.ts
│   └── useTimetable.ts
│
├── services/               # Axios API call wrappers
│   ├── api.ts              # Axios instances + interceptors
│   ├── authService.ts
│   ├── attendanceService.ts
│   ├── notificationService.ts
│   ├── profileService.ts
│   ├── taskService.ts
│   └── timetableService.ts
│
├── store/                  # Zustand global state stores
│   ├── index.ts            # Re-exports all stores
│   ├── authStore.ts
│   ├── attendanceStore.ts
│   ├── taskStore.ts
│   └── timetableStore.ts
│
├── types/                  # TypeScript interfaces & types
│   ├── auth.types.ts
│   ├── attendance.types.ts
│   ├── notification.types.ts
│   ├── task.types.ts
│   └── timetable.types.ts
│
├── utils/                  # Pure helper functions
│   ├── storage.ts          # AsyncStorage wrapper
│   ├── formatters.ts       # Date & text formatters
│   └── errorHandler.ts     # Centralised error parsing
│
├── assets/                 # Static images, fonts, icons
├── .env                    # Local environment config (never commit)
├── app.json                # Expo app configuration
├── eas.json                # EAS Build configuration
├── package.json
└── tsconfig.json
```

---

## 7. Navigation & Routing

The app uses **Expo Router** — a file-based routing system similar to Next.js. Each file inside the `app/` directory automatically becomes a route.

### Route Groups

Expo Router supports **route groups** (folders wrapped in parentheses). These organise screens without affecting the URL path.

| Group | Path | Description |
|---|---|---|
| `(auth)` | `/login`, `/signup`, etc. | Screens accessible without login |
| `(app)` | `/dashboard`, `/tasks`, etc. | Screens requiring authentication |

### How Routing Works at Startup

```
App launches
    │
    ▼
app/_layout.tsx         ← Calls loadSession() to restore auth from AsyncStorage
    │
    ▼
app/index.tsx           ← Always redirects to /(auth)/login
    │
    ├─ If session found → login checks isAuthenticated → navigates to /(app)/dashboard
    │
    └─ No session → stays on /(auth)/login
```

### Tab Navigation

The `(app)` group uses a **bottom tab bar** powered by `CustomTabBar`. The four main tabs are:

| Tab | Screen | Icon |
|---|---|---|
| Home | `dashboard.tsx` | Home icon |
| Tasks | `tasks.tsx` | Checklist icon |
| Tools | `tools.tsx` | Tools icon |
| Profile | `profile.tsx` | Person icon |

The following screens exist inside `(app)` but are **hidden from the tab bar** (navigated to programmatically):

- `notifications`, `task-detail`, `attendance`, `timetable`, `progress`, `permissions`, `request-permission`, `payment`

### Navigating Between Screens

Use Expo Router's `router` or `Link` component:

```tsx
import { router } from 'expo-router';

// Push a new screen onto the stack
router.push('/(app)/attendance');

// Replace current screen
router.replace('/(app)/dashboard');

// Go back
router.back();
```

---

## 8. State Management (Zustand Stores)

Global state is managed with **Zustand**. All stores live in the `store/` directory and are exported from `store/index.ts`.

### Store Overview

| Store | File | State Managed |
|---|---|---|
| Auth | `authStore.ts` | `user`, `intern`, `token`, `isAuthenticated`, `isVerified`, loading & error |
| Tasks | `taskStore.ts` | `tasks[]`, `selectedTask`, loading & error |
| Attendance | `attendanceStore.ts` | `records[]`, loading & error |
| Timetable | `timetableStore.ts` | `entries[]`, loading & error |

### How to Use a Store in a Component

```tsx
import { useAuthStore } from '@/store';

export default function MyScreen() {
  const user = useAuthStore((s) => s.user);
  const intern = useAuthStore((s) => s.intern);
  const logout = useAuthStore((s) => s.logout);

  // Always select only what you need — avoids unnecessary re-renders
}
```

### Auth Store — Key Actions

| Action | Description |
|---|---|
| `login(email, password)` | Authenticates the user, fetches full profile + intern data, saves to storage |
| `logout()` | Calls API logout, clears storage, resets state |
| `loadSession()` | Called on app start — restores user/token/intern from AsyncStorage |
| `forgotPassword(email)` | Sends a password reset code to the email |
| `resetPassword(token, password)` | Resets the password using the code received by email |
| `verifyEmail(code)` | Verifies the intern's email address |

### Task Store — Key Actions

| Action | Description |
|---|---|
| `fetchTasks(positionId)` | Loads all tasks for the intern's internship position |
| `fetchTaskById(id)` | Loads a single task by ID into `selectedTask` |
| `updateTaskStatus(id, status)` | Updates a task's status both on the server and in local state |

### Attendance Store — Key Actions

| Action | Description |
|---|---|
| `fetchAttendance(internId)` | Loads all attendance records for the intern |
| `markAttendance(date, checkIn)` | Creates a new attendance record |

---

## 9. API Layer

### Two Axios Instances

The app maintains two separate Axios instances, both defined in `services/api.ts`:

| Instance | Base URL | Used For |
|---|---|---|
| `authApi` | `AUTH_BASE_URL` | All auth endpoints (login, signup, etc.) |
| `api` (default) | `API_BASE_URL` | All data endpoints (tasks, attendance, etc.) |

### Automatic behaviours (Interceptors)

**Request interceptors (both instances):**
- Automatically attach the JWT token from AsyncStorage as `Authorization: Bearer <token>` header
- The main `api` instance also automatically appends `?_dbname=dims` to every request

**Response interceptors (both instances):**
- On a `401 Unauthorized` response, all local storage (token, user, intern) is automatically cleared

### Endpoint Constants

All API endpoint paths are defined in `constants/api.ts` — **never hardcode paths in service files**.

```ts
// Example usage in a service
import { TASK_ENDPOINTS } from '@/constants/api';

const { data } = await api.get(TASK_ENDPOINTS.GET_ALL);
```

### Services

Each service file is a thin wrapper over Axios that maps to a specific domain:

| Service | File | Responsibilities |
|---|---|---|
| Auth | `authService.ts` | login, logout, signup, verifyEmail, forgotPassword, resetPassword |
| Task | `taskService.ts` | fetch tasks by position ID, fetch by ID, update status |
| Attendance | `attendanceService.ts` | fetch records by intern ID, mark attendance |
| Timetable | `timetableService.ts` | fetch timetable entries |
| Notification | `notificationService.ts` | fetch notifications, mark as read |
| Profile | `profileService.ts` | fetch user by ID, fetch intern by user ID |

### Adding a New API Call

1. Add the endpoint path to `constants/api.ts`
2. Add the typed method to the relevant service file in `services/`
3. Call it from the relevant Zustand store action in `store/`
4. Use the store action in your screen/component

---

## 10. Screens Reference

### Auth Screens — `app/(auth)/`

| Screen | File | Description |
|---|---|---|
| Login | `login.tsx` | Email/password login form |
| Sign Up | `signup.tsx` | New intern registration |
| Forgot Password | `forgot-password.tsx` | Sends reset code to email |
| Verify Code | `verify-code.tsx` | OTP/code entry for email verification |
| Reset Password | `reset-password.tsx` | Sets a new password after code verification |

### App Screens — `app/(app)/`

| Screen | File | Tab? | Description |
|---|---|---|---|
| Dashboard | `dashboard.tsx` | ✅ Home | Overview of intern info, today's timetable, tasks summary |
| Tasks | `tasks.tsx` | ✅ Tasks | List of all assigned tasks |
| Task Detail | `task-detail.tsx` | ❌ | Full details for a single task; allows status updates |
| Tools | `tools.tsx` | ✅ Tools | Links to external tools and resources |
| Profile | `profile.tsx` | ✅ Profile | Intern profile information and settings |
| Attendance | `attendance.tsx` | ❌ | View and mark daily attendance |
| Timetable | `timetable.tsx` | ❌ | Weekly schedule overview |
| Notifications | `notifications.tsx` | ❌ | Inbox for system notifications |
| Progress | `progress.tsx` | ❌ | Internship progress tracker |
| Permissions | `permissions.tsx` | ❌ | View submitted leave/permission requests |
| Request Permission | `request-permission.tsx` | ❌ | Submit a new leave request |
| Payment | `payment.tsx` | ❌ | Payment/stipend information |

---

## 11. Components Reference

### `components/common/` — Generic App Components

| Component | File | Description |
|---|---|---|
| `AppButton` | `AppButton.tsx` | Primary button with loading state support |
| `AppInput` | `AppInput.tsx` | Styled text input with label and error display |
| `AppSelect` | `AppSelect.tsx` | Dropdown/select picker component |
| `AppCard` | `AppCard.tsx` | Generic card container |
| `AppBadge` | `AppBadge.tsx` | Status/label badge chip |
| `Avatar` | `Avatar.tsx` | Circular user avatar |
| `EmptyState` | `EmptyState.tsx` | Illustrated empty list placeholder |
| `LoadingSpinner` | `LoadingSpinner.tsx` | Activity indicator wrapper |
| `ScreenHeader` | `ScreenHeader.tsx` | Consistent screen title bar with back button |

### `components/cards/` — Domain Cards

| Component | File | Description |
|---|---|---|
| `TaskCard` | `TaskCard.tsx` | Displays a single task summary (title, status, deadline) |
| `AttendanceCard` | `AttendanceCard.tsx` | Displays a single attendance record |
| `NotificationCard` | `NotificationCard.tsx` | Displays a single notification item |

### `components/layout/` — Layout & Navigation

| Component | File | Description |
|---|---|---|
| `CustomTabBar` | `CustomTabBar.tsx` | The custom bottom tab bar rendered in `(app)/_layout.tsx` |
| `SafeLayout` | `SafeLayout.tsx` | Wraps screens in `SafeAreaView` with consistent padding |

---

## 12. Types

All TypeScript interfaces are defined in `types/`. Import from here — never duplicate type definitions.

| File | Key Types |
|---|---|
| `auth.types.ts` | `User`, `Intern`, `AuthState`, `LoginPayload`, `LoginResponse`, `SignupPayload`, `SignupResponse` |
| `task.types.ts` | `Task`, `TaskStatus`, `UpdateTaskPayload` |
| `attendance.types.ts` | `AttendanceRecord`, `MarkAttendancePayload` |
| `timetable.types.ts` | `TimetableEntry` |
| `notification.types.ts` | `Notification` |

### Key Type Reference

```ts
// User — the authenticated account
interface User {
  id: string;
  fullname?: string;
  email: string;
  phonenumber?: string;
  role?: string;
}

// Intern — the intern profile linked to a User
interface Intern {
  id: string;
  user_id: string;
  fullname?: string;
  internshipposition_id?: string;
  department?: string;
  supervisorId?: string;
  avatarUrl?: string;
}
```

> **Note:** The `user.id` (from the Auth API) and `intern.user_id` are the same value — the link between the two records.

---

## 13. Utilities

### `utils/storage.ts` — AsyncStorage Wrapper

Provides a typed, named API over `AsyncStorage`. Always use this instead of calling `AsyncStorage` directly.

```ts
import { storage } from '@/utils/storage';

await storage.saveToken(token);
const token = await storage.getToken();
const user = await storage.getUser<User>();
const intern = await storage.getIntern<Intern>();
await storage.clearAll();      // Called on logout
```

Storage keys used internally:
- `dims_token` — JWT token
- `dims_user` — Serialised `User` object
- `dims_intern` — Serialised `Intern` object

### `utils/formatters.ts`

Date and text formatting helpers used across the app.

### `utils/errorHandler.ts`

Centralised error parsing — converts raw Axios errors into user-friendly messages.

---

## 14. Constants & Theme

### `constants/theme.ts`

Defines the entire design system. **Always use these constants in your styles — never use hardcoded colour values or magic numbers.**

```ts
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';

// Brand colours
COLORS.primary        // '#80002a' — Maroon (primary brand)
COLORS.secondary      // '#F17F27' — Orange (accent)
COLORS.background     // '#F8F9FA' — Default screen background
COLORS.surface        // '#FFFFFF' — Card background

// Spacing
SPACING.sm   // 8
SPACING.md   // 15
SPACING.lg   // 20

// Border radius
RADIUS.md    // 10
RADIUS.lg    // 15
```

### `constants/api.ts`

All API endpoint paths. Always import from here:

```ts
import { AUTH_ENDPOINTS, TASK_ENDPOINTS, ATTENDANCE_ENDPOINTS } from '@/constants/api';
```

---

## 15. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Startup                              │
│  _layout.tsx calls loadSession()                                │
│  → reads token + user + intern from AsyncStorage               │
│  → if found: sets isAuthenticated = true                        │
│  → app/index.tsx redirects to /(auth)/login (always)           │
│  → login screen checks isAuthenticated → routes to dashboard   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         Login Flow                              │
│                                                                 │
│  1. User enters email + password                               │
│  2. authStore.login() is called                                 │
│  3. authService.login() → POST /login to Auth API              │
│  4. On success:                                                 │
│     a. Token is saved to AsyncStorage                           │
│     b. profileService.getUserById() fetches full User profile   │
│     c. profileService.getInternByUserId() fetches Intern data   │
│     d. User + Intern are saved to AsyncStorage                  │
│     e. Zustand state updated: isAuthenticated = true            │
│  5. If isVerified === false → navigate to verify-code screen   │
│  6. On success → navigate to /(app)/dashboard                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Password Reset Flow                         │
│                                                                 │
│  1. forgot-password.tsx → POST /forgot-password (email)        │
│  2. User receives a code by email                               │
│  3. verify-code.tsx → POST /verify-email (code)                │
│  4. reset-password.tsx → POST /reset-password (token, password)│
└─────────────────────────────────────────────────────────────────┘
```

---

## 16. Local Storage Strategy

The app uses a **"cache-first"** approach to local storage:

- On **login**: token, user, and intern are saved to AsyncStorage after a successful API call
- On **app restart** (`loadSession`): data is read from AsyncStorage first (fast, no network)
  - If `intern` is missing from storage, the app silently fetches it from the API and saves it
- On **logout**: all three keys (`dims_token`, `dims_user`, `dims_intern`) are cleared
- On **401 error**: storage is automatically cleared by the Axios response interceptor

---

## 17. Adding New Features — A Checklist

Follow this checklist whenever adding a new feature:

- [ ] **Type it** — Add interfaces/types to the appropriate file in `types/`
- [ ] **Add endpoints** — Add path constants to `constants/api.ts`
- [ ] **Write the service** — Add API call methods to an existing or new service file in `services/`
- [ ] **Update the store** — Add state and actions to the appropriate Zustand store in `store/`
- [ ] **Create the screen** — Add a new `.tsx` file inside `app/(app)/` or `app/(auth)/`
- [ ] **Register the route** — If it needs a tab, add it to `app/(app)/_layout.tsx`
- [ ] **Build UI from existing components** — Use `AppButton`, `AppInput`, `SafeLayout`, etc. from `components/common/` before creating new ones
- [ ] **Use theme constants** — All colours, spacing, and radius values must come from `constants/theme.ts`

---

## 18. Running & Building the App

### Development

```bash
# Start Expo dev server
npm start

# Open directly on Android emulator
npm run android

# Open directly on iOS simulator
npm run ios

# Open in browser (limited functionality)
npm run web
```

### Linting

```bash
npm run lint
```

### Production Build (EAS)

The project uses **Expo Application Services (EAS)** for production builds. Configuration is in `eas.json`.

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

> You will need to be logged into the Expo/EAS account linked to this project. Contact a team lead for credentials.

---

## 19. Code Style & Conventions

### File & Folder Naming
- Screen files: **`kebab-case.tsx`** (e.g., `task-detail.tsx`)
- Component files: **`PascalCase.tsx`** (e.g., `TaskCard.tsx`)
- Store/service/util files: **`camelCase.ts`** (e.g., `authStore.ts`)
- Type files: **`domain.types.ts`** (e.g., `task.types.ts`)

### Imports
- Use the `@/` path alias for all internal imports (configured in `tsconfig.json`)
  ```ts
  // ✅ Correct
  import { COLORS } from '@/constants/theme';
  
  // ❌ Avoid
  import { COLORS } from '../../constants/theme';
  ```

### State & Data
- Always use **Zustand stores** for shared/global state — do not pass data through deeply nested props
- **Never call services directly from screens** — always go through a store action
- Handle `isLoading` and `error` states in every screen that fetches data

### Components
- Keep screens focused on layout and data wiring only — extract reusable UI into `components/`
- Use `SafeLayout` as the root wrapper for every screen instead of raw `View`

### TypeScript
- Avoid `any` — if you must use it temporarily, leave a `// TODO: type this` comment
- All API response shapes should have a corresponding interface in `types/`

---

*For questions, contact the project maintainer or check internal documentation on the DigiMark Notion workspace.*
