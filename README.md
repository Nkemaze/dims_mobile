# DIMS Intern Mobile App

DigiMark Internship Management System — React Native (Expo) frontend for interns.

## Tech Stack
- **Expo** (SDK 54) + **expo-router** (file-based routing)
- **React Native** 0.81
- **Zustand** — global state management
- **Axios** — API communication with JWT interceptor
- **AsyncStorage** — token/user persistence
- **TypeScript**

## Folder Structure
```
app/          → Expo Router screens ((auth), (app) groups)
components/   → Reusable UI (common, cards, layout)
services/     → Axios API service layer
store/        → Zustand global stores
hooks/        → Custom React hooks
constants/    → Theme, API URLs, enumerations
types/        → TypeScript interfaces
utils/        → Storage, formatters, error handling
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
npm install axios zustand @react-native-async-storage/async-storage date-fns
```

### 2. Configure Environment
Create a `.env` file in the project root:
```
EXPO_PUBLIC_API_BASE_URL=http://your-backend-url/api
```

### 3. Run the App
```bash
npm start          # Expo Dev Tools
npm run android    # Android emulator
npm run ios        # iOS simulator
```

## Authentication Flow
1. App loads → checks AsyncStorage for saved token
2. Token found → redirect to `/(app)/dashboard`
3. No token → redirect to `/(auth)/login`
4. 401 response → clears token, redirects to login
