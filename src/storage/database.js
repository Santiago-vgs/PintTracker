import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SESSIONS: '@pint_tracker_sessions',
  DRINKS: '@pint_tracker_drinks',
  RECENT_DRINKS: '@pint_tracker_recent_drinks',
  ACTIVE_SESSION: '@pint_tracker_active_session',
};

// Sessions
export const saveSessions = async (sessions) => {
  try {
    await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving sessions:', error);
  }
};

export const getSessions = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

// Active Session
export const saveActiveSession = async (session) => {
  try {
    await AsyncStorage.setItem(KEYS.ACTIVE_SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving active session:', error);
  }
};

export const getActiveSession = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.ACTIVE_SESSION);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting active session:', error);
    return null;
  }
};

export const clearActiveSession = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.ACTIVE_SESSION);
  } catch (error) {
    console.error('Error clearing active session:', error);
  }
};

// Recent Drinks (for quick-add)
export const saveRecentDrinks = async (drinks) => {
  try {
    await AsyncStorage.setItem(KEYS.RECENT_DRINKS, JSON.stringify(drinks));
  } catch (error) {
    console.error('Error saving recent drinks:', error);
  }
};

export const getRecentDrinks = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.RECENT_DRINKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recent drinks:', error);
    return [];
  }
};

export const addToRecentDrinks = async (drinkName) => {
  try {
    const recent = await getRecentDrinks();
    const filtered = recent.filter(name => name !== drinkName);
    const updated = [drinkName, ...filtered].slice(0, 10); // Keep last 10
    await saveRecentDrinks(updated);
  } catch (error) {
    console.error('Error adding to recent drinks:', error);
  }
};
