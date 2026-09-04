# Notifications Guide

A simple walkthrough of how notifications work in this Reminder app.

This project uses [**Notifee**](https://notifee.app/react-native/docs/overview) for local notifications. Push notifications (FCM) are explained at the end as a next step.

---

## What you will learn

| Level | Topic |
|-------|--------|
| Basic | Permission, channels, show / update / cancel |
| Basic | Tap notification → open a screen |
| Intermediate | Schedule reminders at a custom time |
| Intermediate | Repeating reminders (every X minutes) |
| Intermediate | Action buttons (Snooze, Done, Dismiss) |
| Next | Firebase Cloud Messaging (FCM) |

---

## App tabs

| Tab | Purpose |
|-----|---------|
| **Reminders** | Create real scheduled reminders |
| **Learn** | Try each notification feature step by step |

---

## How the app starts

Read these files in order:

### 1. `index.js` — entry point

```js
notifee.onBackgroundEvent(handleNotificationEvent);
```

- Runs **before** React loads.
- Handles notification events when the app is in the **background** or **killed**.
- Must stay at the top level (not inside a component).

### 2. `App.tsx` — React entry

```tsx
useNotificationBootstrap();
```

Calls bootstrap on app launch (channels, cold-start navigation, foreground listener).

### 3. `src/hooks/useNotificationBootstrap.ts`

On mount it:

1. Creates Android notification channels
2. Checks if the app was opened from a notification (`getInitialNotification`)
3. Subscribes to foreground notification events

---

## Notification service layer

All notification logic lives in `src/services/notifications/`. Screens should call these helpers — not Notifee directly.

```
src/services/notifications/
├── constants.ts      # Channel IDs, action IDs, data keys
├── types.ts          # TypeScript types
├── channels.ts       # Create Android channels
├── permissions.ts    # Request & check permission
├── display.ts        # Show, update, cancel, schedule
├── eventHandlers.ts  # Handle press / dismiss / actions
├── navigation.ts     # Navigate when user taps notification
├── bootstrap.ts      # App startup setup
└── index.ts          # Public exports
```

### `channels.ts`

Android requires a **channel** for every notification.

- `reminders` — scheduled reminder alerts (high importance)
- `learning` — demo notifications on the Learn tab

### `permissions.ts`

- `requestNotificationPermission()` — ask the user (required on Android 13+ and iOS)
- `getNotificationPermissionState()` — check current status

### `display.ts`

| Function | What it does |
|----------|----------------|
| `displayLocalNotification()` | Show immediately |
| `updateLocalNotification()` | Update by same ID |
| `cancelLocalNotification()` | Remove from tray |
| `scheduleReminderNotification()` | Fire once at a timestamp |
| `scheduleRepeatingReminderNotification()` | Repeat every X minutes (min 15) |
| `displaySimulatedPushNotification()` | Demo of how FCM + Notifee work together |

---

## Event flow

When the user interacts with a notification:

```
User taps notification
        │
        ▼
┌───────────────────┐
│  App in foreground? │
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    │           │
   Yes          No
    │           │
    ▼           ▼
bootstrap.ts   index.js
onForeground   onBackground
Event          Event
    │           │
    └─────┬─────┘
          ▼
  eventHandlers.ts
          │
    ┌─────┼─────┐
    │     │     │
  PRESS ACTION DISMISS
    │     │     │
    ▼     ▼     ▼
navigation  snooze /   log only
handler     complete
```

### `eventHandlers.ts`

Handles three event types:

| Event | What happens |
|-------|----------------|
| `PRESS` | Navigate to Home or Learn tab |
| `ACTION_PRESS` | Snooze (reschedule +5 min), Done, or Dismiss |
| `DISMISSED` | User swiped away — logged only |

### `navigation.ts`

Notifications carry a `data` payload:

```ts
{
  screenName: 'Home' | 'Search',
  reminderId: 'reminder-123',  // optional
  type: 'reminder' | 'learning'
}
```

`navigateToTab()` opens the correct tab inside the bottom navigator.

---

## Reminders feature

### UI files

```
src/features/home/
├── screens/HomeScreen.tsx       # List + form
├── components/AddReminderForm.tsx
└── components/ReminderCard.tsx
```

### State

```
src/store/slice/reminders/remindersSlice.ts   # Redux store
src/hooks/useReminders.ts                     # create / complete / delete
src/types/reminderSchedule.ts                 # Schedule validation & helpers
```

### Schedule modes (`AddReminderForm`)

| Mode | Example |
|------|---------|
| **In minutes** | "Remind me in 10 minutes" |
| **Exact time** | "Tomorrow at 9:00 AM" (date/time picker) |
| **Repeating** | "Every 30 minutes" (minimum 15 min) |

### Creating a reminder

```
User fills form
      │
      ▼
useReminders.createReminder()
      │
      ├── requestNotificationPermission()
      │
      ├── scheduleReminderNotification()        (once)
      │   or
      │   scheduleRepeatingReminderNotification() (repeat)
      │
      └── dispatch(addReminder())  → saved in Redux + MMKV
```

---

## Learn tab (hands-on demos)

File: `src/features/search/screens/SearchScreen.tsx`

| Step | Concept | Key function |
|------|---------|--------------|
| 1 | Permission | `requestNotificationPermission()` |
| 2 | Display | `displayLocalNotification()` |
| 3 | Update | `updateLocalNotification()` |
| 4 | Actions | `showActions: true` |
| 5 | Cancel | `cancelLocalNotification()` |
| 6 | Simulated push | `displaySimulatedPushNotification()` |

Try each button, then read the matching function in `display.ts`.

---

## Android setup

File: `android/app/src/main/AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

Icon: `android/app/src/main/res/drawable/ic_noti_small.xml`

Gradle PATH fix (if `node` not found during build): `android/gradlew` adds Homebrew to `PATH`.

---

## Suggested reading order

Follow this path to understand the full flow:

1. `index.js`
2. `App.tsx` → `useNotificationBootstrap.ts`
3. `services/notifications/bootstrap.ts`
4. `services/notifications/channels.ts`
5. `services/notifications/permissions.ts`
6. `services/notifications/display.ts`
7. `SearchScreen.tsx` (try step 2 — display)
8. `services/notifications/eventHandlers.ts`
9. `services/notifications/navigation.ts`
10. `AddReminderForm.tsx` → `useReminders.ts`
11. Schedule a 1-minute reminder and watch it fire

---

## Next step: real push (FCM)

Local notifications are created on the device. **Push notifications** are sent from a server via Firebase.

High-level flow:

```
Firebase Console / your server
            │
            ▼
   FCM delivers payload
            │
            ▼
 messaging().onMessage()          (app open)
 messaging().setBackgroundMessageHandler()  (app closed)
            │
            ▼
   notifee.displayNotification()   ← same as step 6 in Learn tab
            │
            ▼
   eventHandlers.ts                ← same tap handling as today
```

To add FCM:

1. Create a Firebase project
2. Add `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
3. Install `@react-native-firebase/app` and `@react-native-firebase/messaging`
4. In `onMessage`, call `displayLocalNotification()` with the remote payload

The **Simulate push** button on the Learn tab shows exactly what your FCM handler should do.

---

## Quick reference

| I want to… | Open this file |
|------------|----------------|
| Show a notification now | `display.ts` → `displayLocalNotification` |
| Schedule for later | `display.ts` → `scheduleReminderNotification` |
| Repeat every X minutes | `display.ts` → `scheduleRepeatingReminderNotification` |
| Handle a tap | `eventHandlers.ts` |
| Open a screen from notification | `navigation.ts` |
| Ask permission | `permissions.ts` |
| Create a reminder in UI | `AddReminderForm.tsx` |
| Try demos | `SearchScreen.tsx` |

---

## Run the app

```bash
yarn start
yarn react-native run-android
# or
yarn react-native run-ios
```

Grant notification permission when prompted, then explore the **Learn** and **Reminders** tabs.
