import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getActiveSession, getSessions } from '../storage/database';

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [activeSession, setActiveSession] = useState(null);
  const [stats, setStats] = useState({
    totalDrinks: 0,
    totalSessions: 0,
    weeklyDrinks: 0,
    monthlyDrinks: 0,
    topDrink: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const active = await getActiveSession();
    setActiveSession(active);
    await calculateStats();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const calculateStats = async () => {
    const sessions = await getSessions();

    const totalDrinks = sessions.reduce((sum, s) => sum + s.drinks.length, 0);
    const totalSessions = sessions.length;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weeklyDrinks = sessions
      .filter(s => new Date(s.startTime) >= weekAgo)
      .reduce((sum, s) => sum + s.drinks.length, 0);

    const monthlyDrinks = sessions
      .filter(s => new Date(s.startTime) >= monthAgo)
      .reduce((sum, s) => sum + s.drinks.length, 0);

    // Find top drink
    const drinkCounts = {};
    sessions.forEach(s => {
      s.drinks.forEach(d => {
        drinkCounts[d.name] = (drinkCounts[d.name] || 0) + 1;
      });
    });

    const topDrink = Object.keys(drinkCounts).length > 0
      ? Object.entries(drinkCounts).sort((a, b) => b[1] - a[1])[0]
      : null;

    setStats({
      totalDrinks,
      totalSessions,
      weeklyDrinks,
      monthlyDrinks,
      topDrink,
    });
  };

  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 16,
    },
    activeSessionCard: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    activeSessionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 12,
    },
    activeSessionInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    activeSessionText: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    statsContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      flex: 1,
      minWidth: '45%',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    actionButton: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 16,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeSession ? (
          <View style={styles.activeSessionCard}>
            <Text style={styles.activeSessionTitle}>
              {activeSession.name || 'Current Session'}
            </Text>
            <View style={styles.activeSessionInfo}>
              <Text style={styles.activeSessionText}>
                Drinks: {activeSession.drinks.length}
              </Text>
              <Text style={styles.activeSessionText}>
                Duration: {formatDuration(Date.now() - activeSession.startTime)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Log')}
            >
              <Text style={styles.actionButtonText}>Add Drink</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Log')}
          >
            <Text style={styles.actionButtonText}>Start New Session</Text>
          </TouchableOpacity>
        )}

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalDrinks}</Text>
              <Text style={styles.statLabel}>Total Drinks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.weeklyDrinks}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.monthlyDrinks}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
          {stats.topDrink && (
            <View style={[styles.statCard, { marginTop: 12 }]}>
              <Text style={styles.statLabel}>Top Drink</Text>
              <Text style={[styles.statValue, { fontSize: 20 }]}>
                {stats.topDrink[0]} ({stats.topDrink[1]}x)
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
