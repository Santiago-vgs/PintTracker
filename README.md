# 🍺 Pint Tracker

The fun, effortless way to track your drinks and relive your nights out – like Strava for drinking sessions.

## Features

### Core Functionality
- **Session-Based Tracking**: Start/end drinking sessions with live running totals
- **Quick Drink Logging**: Add drinks with name, type, quantity, price, and notes
- **Smart Quick-Add Bar**: Recently used drinks appear as one-tap chips
- **Drink Types**: Beer, Wine, Cocktail, Shot, and Other with emoji icons

### Stats & Analytics
- **Personal Dashboard**: View your stats - total drinks, sessions, weekly/monthly totals
- **Session History**: Browse all past sessions with detailed drink lists
- **Yearly Recap**: Spotify Wrapped-style yearly summary with fun stats like:
  - Total drinks and sessions
  - Top drink and favorite type
  - Longest night and biggest session
  - Busiest month
  - Total spent

### User Experience
- **Dark/Light Mode**: Auto-switching theme with manual toggle
- **Haptic Feedback**: Satisfying vibrations on interactions
- **Local Storage**: All data stored on your device (no backend needed)
- **Clean Modern UI**: Card-based design with smooth animations

## Getting Started

### Prerequisites
- Node.js installed
- Expo Go app on your phone (iOS or Android)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## Usage

1. **Start a Session**: Tap "Start New Session" on the Log tab
2. **Add Drinks**: Select drink type, enter name and details, tap "Add Drink"
3. **Quick Add**: Tap recent drinks for faster logging
4. **View Stats**: Check Home tab for real-time session stats and overall analytics
5. **End Session**: Tap "End Session" when done
6. **View History**: Browse past sessions in the History tab
7. **Yearly Recap**: Check the Recap tab for your year in review

## Project Structure

```
PintTracker/
├── src/
│   ├── screens/         # Main app screens
│   │   ├── HomeScreen.js
│   │   ├── LogScreen.js
│   │   ├── HistoryScreen.js
│   │   ├── RecapScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/      # Navigation setup
│   ├── contexts/        # React contexts (theme)
│   ├── storage/         # Local storage utilities
│   └── utils/           # Helper functions
├── App.js              # Main app entry
└── package.json
```

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development tools and runtime
- **React Navigation**: Navigation library
- **AsyncStorage**: Local data persistence
- **Expo Haptics**: Touch feedback

## Roadmap

### Phase 1 (Current - Solo MVP)
- ✅ Session tracking
- ✅ Drink logging with types
- ✅ Stats dashboard
- ✅ History view
- ✅ Yearly recap
- ✅ Dark mode

### Phase 2 (Social Features)
- User authentication
- Friend connections
- Activity feed (like Strava)
- Session sharing
- Comments and reactions
- Leaderboards

### Phase 3 (Enhanced Features)
- Photo attachments per session
- Venue check-ins
- Drink recommendations
- Export data (CSV/PDF)
- Cloud sync
- Push notifications

## Development

Run on different platforms:

```bash
# iOS (requires Mac)
npm run ios

# Android
npm run android

# Web
npm run web
```

## License

This project is for personal use.

## Version

1.0.0 - Initial Release
