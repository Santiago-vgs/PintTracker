# PintTracker

A project for tracking pints.

## Getting Started

This repository is currently being set up.


instructions:

Pint Tracker App Summary (Optimized for Claude Coding Prompt)
App Name: Pint Tracker
Tagline: The fun, effortless way to track your drinks and relive your nights out – like Strava for drinking sessions.
Core Concept
Pint Tracker is a mobile app that makes logging drinks during nights out (or casual sessions) quick, intuitive, and rewarding. It turns drinking into trackable “sessions” with stats, insights, and a viral Spotify Wrapped-style yearly recap. The long-term vision is a social network where friends share sessions (like Strava activities), but for the current solo development phase, focus entirely on a local-only, polished personal tracker – no auth, no backend, no social features yet.
Target User
Social young adults who enjoy nights out with friends and want a lighthearted way to track habits, see patterns, and get fun recaps.
Current Implemented Foundation
•  Main logging screen with clean form: Date (auto or selectable), Drink Name (text), Quantity (number), optional Price and Comment.
•  “Add Drink” button appends to a “Today’s Drinks” (or current session) list, grouped by date.
•  Smart quick-add bar: Shows recently used drinks as tappable chips; tap one → auto-fills name → prompt for quantity → one-tap add.
Key Features to Build Next (Minimum for a “Sick” Professional Demo)
Prioritize speed and visual polish – aim for a premium feel with modern UI (clean cards, subtle animations, dark/light mode, icons).
1.  Session-Based Tracking
	•  Replace “Today’s Drinks” with explicit “Sessions”.
	•  “Start New Session” button (optional session name like “Pub Crawl”). Auto-starts timer.
	•  Live running totals (e.g., total drinks, total volume in pints/ml, total spent).
	•  “End Session” → saves and shows summary card.
2.  Session History & Details
	•  List of past sessions (date, duration, totals).
	•  Tap session → detailed view with timestamped drink list.
3.  Personal Stats Dashboard
	•  Home screen: Current/active session at top, then weekly/monthly/yearly aggregates (total drinks, average per session, top drinks, etc.).
	•  Simple visualizations (progress rings, basic charts).
4.  Yearly Recap (The Wow Feature)
	•  Dedicated “2026 Recap” screen (generate on-demand or auto at year-end).
	•  Scrollable vibrant cards: “You had X drinks in Y sessions”, “Top Drink: [Name]”, “Longest Night: Z hours”, “Busiest Month”, “Total Spent”, with fun emojis/icons.
	•  Make it screenshot-friendly for easy sharing.
5.  Polish & UX Enhancements
	•  Drink type selector (icons: Beer, Wine, Cocktail, Shot, etc.) for better categorization.
	•  Favorites/quick-add improvements.
	•  Photo attachment per session (optional, for future sharing).
	•  Onboarding flow, settings (units, theme), export data.
Navigation Structure
Bottom tabs:
•  Home (Dashboard + current session)
•  Log/Add (main logging screen)
•  History
•  Recap
•  Profile/Settings
Design Inspiration
Aim for a clean, modern vibe blending:
•  Quick logging like Untappd beer check-ins.
•  Stats dashboards like Strava.
•  Fun recaps like Spotify Wrapped.

Tech Notes
•  Keep all data local (e.g., Hive, SQLite, or SharedPreferences + JSON).
•  No networking/social yet – perfect for rapid solo iteration.
•  Focus on smooth animations, haptics, and responsive layouts to make it feel pro.
This version will look and feel like a complete, addictive app ready for beta testing or app store previews. Once polished, adding social (friends/feed/sharing) will be the natural next phase.
