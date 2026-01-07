import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import * as Haptics from '../utils/haptics';
import {
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  getSessions,
  saveSessions,
  getRecentDrinks,
  addToRecentDrinks,
} from '../storage/database';

const DRINK_TYPES = [
  { id: 'beer', label: 'Beer', emoji: '🍺' },
  { id: 'wine', label: 'Wine', emoji: '🍷' },
  { id: 'cocktail', label: 'Cocktail', emoji: '🍹' },
  { id: 'shot', label: 'Shot', emoji: '🥃' },
  { id: 'other', label: 'Other', emoji: '🥤' },
];

const LogScreen = () => {
  const { theme } = useTheme();
  const [activeSession, setActiveSession] = useState(null);
  const [sessionName, setSessionName] = useState('');
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Drink form state
  const [drinkName, setDrinkName] = useState('');
  const [drinkType, setDrinkType] = useState('beer');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [comment, setComment] = useState('');

  const [recentDrinks, setRecentDrinks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const active = await getActiveSession();
    setActiveSession(active);
    const recent = await getRecentDrinks();
    setRecentDrinks(recent);
  };

  const startNewSession = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newSession = {
      id: Date.now().toString(),
      name: sessionName || 'Session',
      startTime: Date.now(),
      endTime: null,
      drinks: [],
      totalSpent: 0,
    };
    await saveActiveSession(newSession);
    setActiveSession(newSession);
    setShowSessionModal(false);
    setSessionName('');
  };

  const endSession = async () => {
    if (!activeSession) return;

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const endedSession = {
      ...activeSession,
      endTime: Date.now(),
    };

    const sessions = await getSessions();
    await saveSessions([endedSession, ...sessions]);
    await clearActiveSession();
    setActiveSession(null);

    Alert.alert(
      'Session Ended',
      `Total drinks: ${endedSession.drinks.length}\nDuration: ${formatDuration(endedSession.endTime - endedSession.startTime)}`,
      [{ text: 'OK' }]
    );
  };

  const addDrink = async () => {
    if (!drinkName.trim()) {
      Alert.alert('Error', 'Please enter a drink name');
      return;
    }

    if (!activeSession) {
      setShowSessionModal(true);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newDrink = {
      id: Date.now().toString(),
      name: drinkName.trim(),
      type: drinkType,
      quantity: parseFloat(quantity) || 1,
      price: price ? parseFloat(price) : null,
      comment: comment.trim(),
      timestamp: Date.now(),
    };

    const updatedSession = {
      ...activeSession,
      drinks: [...activeSession.drinks, newDrink],
      totalSpent: activeSession.totalSpent + (newDrink.price || 0),
    };

    await saveActiveSession(updatedSession);
    await addToRecentDrinks(drinkName.trim());
    setActiveSession(updatedSession);

    // Reset form
    setDrinkName('');
    setQuantity('1');
    setPrice('');
    setComment('');
    loadData();
  };

  const quickAddDrink = async (name) => {
    setDrinkName(name);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 16,
    },
    sessionCard: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    sessionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    sessionInfo: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.9,
      marginBottom: 4,
    },
    endButton: {
      backgroundColor: '#FFFFFF',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    endButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    recentDrinksContainer: {
      marginBottom: 20,
    },
    recentDrinksTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 10,
    },
    recentDrinksScroll: {
      flexDirection: 'row',
      gap: 8,
    },
    recentDrinkChip: {
      backgroundColor: theme.card,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    recentDrinkText: {
      color: theme.text,
      fontSize: 14,
    },
    formSection: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    drinkTypesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    drinkTypeButton: {
      flex: 1,
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 4,
      backgroundColor: theme.surface,
      borderWidth: 2,
      borderColor: theme.border,
    },
    drinkTypeButtonActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryLight + '20',
    },
    drinkTypeEmoji: {
      fontSize: 24,
      marginBottom: 4,
    },
    drinkTypeLabel: {
      fontSize: 12,
      color: theme.text,
    },
    input: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.text,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    rowInput: {
      flex: 1,
    },
    addButton: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    drinksListContainer: {
      marginBottom: 20,
    },
    drinkItem: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    drinkItemInfo: {
      flex: 1,
    },
    drinkItemName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    drinkItemDetails: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 2,
    },
    drinkItemTime: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    startButton: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 100,
    },
    startButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 24,
      width: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalButtonPrimary: {
      backgroundColor: theme.primary,
    },
    modalButtonSecondary: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalButtonTextPrimary: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    modalButtonTextSecondary: {
      color: theme.text,
    },
  });

  if (!activeSession) {
    return (
      <View style={styles.container}>
        <View style={styles.scrollContent}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowSessionModal(true)}
          >
            <Text style={styles.startButtonText}>Start New Session</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showSessionModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSessionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Start New Session</Text>
              <TextInput
                style={styles.input}
                placeholder="Session name (optional)"
                placeholderTextColor={theme.textSecondary}
                value={sessionName}
                onChangeText={setSessionName}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setShowSessionModal(false)}
                >
                  <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={startNewSession}
                >
                  <Text style={styles.modalButtonTextPrimary}>Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.sessionCard}>
          <Text style={styles.sessionTitle}>{activeSession.name}</Text>
          <Text style={styles.sessionInfo}>
            Drinks: {activeSession.drinks.length}
          </Text>
          <Text style={styles.sessionInfo}>
            Duration: {formatDuration(Date.now() - activeSession.startTime)}
          </Text>
          {activeSession.totalSpent > 0 && (
            <Text style={styles.sessionInfo}>
              Spent: ${activeSession.totalSpent.toFixed(2)}
            </Text>
          )}
          <TouchableOpacity style={styles.endButton} onPress={endSession}>
            <Text style={styles.endButtonText}>End Session</Text>
          </TouchableOpacity>
        </View>

        {recentDrinks.length > 0 && (
          <View style={styles.recentDrinksContainer}>
            <Text style={styles.recentDrinksTitle}>Recent Drinks</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.recentDrinksScroll}>
                {recentDrinks.map((drink, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentDrinkChip}
                    onPress={() => quickAddDrink(drink)}
                  >
                    <Text style={styles.recentDrinkText}>{drink}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Add Drink</Text>

          <View style={styles.drinkTypesContainer}>
            {DRINK_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.drinkTypeButton,
                  drinkType === type.id && styles.drinkTypeButtonActive,
                ]}
                onPress={() => setDrinkType(type.id)}
              >
                <Text style={styles.drinkTypeEmoji}>{type.emoji}</Text>
                <Text style={styles.drinkTypeLabel}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Drink name"
            placeholderTextColor={theme.textSecondary}
            value={drinkName}
            onChangeText={setDrinkName}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.rowInput]}
              placeholder="Quantity"
              placeholderTextColor={theme.textSecondary}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.rowInput]}
              placeholder="Price ($)"
              placeholderTextColor={theme.textSecondary}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Comment (optional)"
            placeholderTextColor={theme.textSecondary}
            value={comment}
            onChangeText={setComment}
          />

          <TouchableOpacity style={styles.addButton} onPress={addDrink}>
            <Text style={styles.addButtonText}>Add Drink</Text>
          </TouchableOpacity>
        </View>

        {activeSession.drinks.length > 0 && (
          <View style={styles.drinksListContainer}>
            <Text style={styles.sectionTitle}>Today's Drinks</Text>
            {activeSession.drinks
              .slice()
              .reverse()
              .map((drink) => (
                <View key={drink.id} style={styles.drinkItem}>
                  <View style={styles.drinkItemInfo}>
                    <Text style={styles.drinkItemName}>
                      {DRINK_TYPES.find(t => t.id === drink.type)?.emoji} {drink.name}
                    </Text>
                    <Text style={styles.drinkItemDetails}>
                      Qty: {drink.quantity}
                      {drink.price && ` • $${drink.price.toFixed(2)}`}
                      {drink.comment && ` • ${drink.comment}`}
                    </Text>
                  </View>
                  <Text style={styles.drinkItemTime}>
                    {formatTime(drink.timestamp)}
                  </Text>
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default LogScreen;
