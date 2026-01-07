import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Haptics don't work on web, so we provide safe wrappers
export const impactAsync = async (style) => {
  if (Platform.OS !== 'web') {
    try {
      await Haptics.impactAsync(style);
    } catch (error) {
      // Silently fail on unsupported platforms
    }
  }
};

export const notificationAsync = async (type) => {
  if (Platform.OS !== 'web') {
    try {
      await Haptics.notificationAsync(type);
    } catch (error) {
      // Silently fail on unsupported platforms
    }
  }
};

export const ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle;
export const NotificationFeedbackType = Haptics.NotificationFeedbackType;
