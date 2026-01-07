import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getSessions } from '../storage/database';

const DRINK_TYPES = [
  { id: 'beer', label: 'Beer', emoji: '🍺' },
  { id: 'wine', label: 'Wine', emoji: '🍷' },
  { id: 'cocktail', label: 'Cocktail', emoji: '🍹' },
  { id: 'shot', label: 'Shot', emoji: '🥃' },
  { id: 'other', label: 'Other', emoji: '🥤' },
];

const HistoryScreen = () => {
  const { theme } = useTheme();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [])
  );

  const loadSessions = async () => {
    const data = await getSessions();
    setSessions(data);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const openSessionDetail = (session) => {
    setSelectedSession(session);
    setModalVisible(true);
  };

  const renderSessionItem = ({ item }) => {
    const duration = item.endTime - item.startTime;

    return (
      <TouchableOpacity
        style={styles.sessionCard}
        onPress={() => openSessionDetail(item)}
      >
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionName}>{item.name}</Text>
          <Text style={styles.sessionDate}>{formatDate(item.startTime)}</Text>
        </View>
        <View style={styles.sessionStats}>
          <View style={styles.sessionStat}>
            <Text style={styles.sessionStatValue}>{item.drinks.length}</Text>
            <Text style={styles.sessionStatLabel}>Drinks</Text>
          </View>
          <View style={styles.sessionStat}>
            <Text style={styles.sessionStatValue}>
              {formatDuration(duration)}
            </Text>
            <Text style={styles.sessionStatLabel}>Duration</Text>
          </View>
          {item.totalSpent > 0 && (
            <View style={styles.sessionStat}>
              <Text style={styles.sessionStatValue}>
                ${item.totalSpent.toFixed(0)}
              </Text>
              <Text style={styles.sessionStatLabel}>Spent</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    sessionCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sessionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sessionName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    sessionDate: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    sessionStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    sessionStat: {
      alignItems: 'center',
    },
    sessionStatValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary,
    },
    sessionStatLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '80%',
    },
    modalHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    modalStatsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      backgroundColor: theme.surface,
    },
    modalStat: {
      alignItems: 'center',
    },
    modalStatValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.primary,
    },
    modalStatLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
    },
    drinksListContainer: {
      padding: 20,
    },
    drinksListTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    drinkItem: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    drinkItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    drinkItemName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    drinkItemTime: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    drinkItemDetails: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    closeButton: {
      backgroundColor: theme.primary,
      padding: 16,
      margin: 20,
      borderRadius: 12,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No sessions yet.{'\n'}Start tracking your drinks to see history here!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedSession?.name || 'Session'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {selectedSession &&
                  `${formatDate(selectedSession.startTime)} • ${formatTime(selectedSession.startTime)} - ${formatTime(selectedSession.endTime)}`}
              </Text>
            </View>

            {selectedSession && (
              <>
                <View style={styles.modalStatsContainer}>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatValue}>
                      {selectedSession.drinks.length}
                    </Text>
                    <Text style={styles.modalStatLabel}>Drinks</Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatValue}>
                      {formatDuration(
                        selectedSession.endTime - selectedSession.startTime
                      )}
                    </Text>
                    <Text style={styles.modalStatLabel}>Duration</Text>
                  </View>
                  {selectedSession.totalSpent > 0 && (
                    <View style={styles.modalStat}>
                      <Text style={styles.modalStatValue}>
                        ${selectedSession.totalSpent.toFixed(2)}
                      </Text>
                      <Text style={styles.modalStatLabel}>Spent</Text>
                    </View>
                  )}
                </View>

                <ScrollView style={styles.drinksListContainer}>
                  <Text style={styles.drinksListTitle}>Drinks</Text>
                  {selectedSession.drinks.map((drink) => (
                    <View key={drink.id} style={styles.drinkItem}>
                      <View style={styles.drinkItemHeader}>
                        <Text style={styles.drinkItemName}>
                          {DRINK_TYPES.find(t => t.id === drink.type)?.emoji} {drink.name}
                        </Text>
                        <Text style={styles.drinkItemTime}>
                          {formatTime(drink.timestamp)}
                        </Text>
                      </View>
                      <Text style={styles.drinkItemDetails}>
                        Qty: {drink.quantity}
                        {drink.price && ` • $${drink.price.toFixed(2)}`}
                        {drink.comment && ` • ${drink.comment}`}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HistoryScreen;
