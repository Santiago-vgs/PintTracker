import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getSessions } from '../storage/database';

const { width } = Dimensions.get('window');

const RecapScreen = () => {
  const { theme } = useTheme();
  const [yearStats, setYearStats] = useState(null);
  const currentYear = new Date().getFullYear();

  useFocusEffect(
    useCallback(() => {
      calculateYearStats();
    }, [])
  );

  const calculateYearStats = async () => {
    const sessions = await getSessions();
    const yearStart = new Date(currentYear, 0, 1).getTime();
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59).getTime();

    const yearSessions = sessions.filter(
      (s) => s.startTime >= yearStart && s.startTime <= yearEnd
    );

    if (yearSessions.length === 0) {
      setYearStats(null);
      return;
    }

    const totalDrinks = yearSessions.reduce((sum, s) => sum + s.drinks.length, 0);
    const totalSessions = yearSessions.length;
    const totalSpent = yearSessions.reduce((sum, s) => sum + s.totalSpent, 0);

    // Longest session
    const longestSession = yearSessions.reduce((max, s) => {
      const duration = s.endTime - s.startTime;
      return duration > (max.endTime - max.startTime) ? s : max;
    });
    const longestDuration = longestSession.endTime - longestSession.startTime;

    // Most drinks in one session
    const biggestSession = yearSessions.reduce((max, s) => {
      return s.drinks.length > max.drinks.length ? s : max;
    });

    // Top drink
    const drinkCounts = {};
    yearSessions.forEach((s) => {
      s.drinks.forEach((d) => {
        drinkCounts[d.name] = (drinkCounts[d.name] || 0) + 1;
      });
    });
    const topDrink = Object.entries(drinkCounts).sort((a, b) => b[1] - a[1])[0];

    // Busiest month
    const monthCounts = {};
    yearSessions.forEach((s) => {
      const month = new Date(s.startTime).getMonth();
      monthCounts[month] = (monthCounts[month] || 0) + s.drinks.length;
    });
    const busiestMonth = Object.entries(monthCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    // Favorite drink type
    const typeCounts = {};
    yearSessions.forEach((s) => {
      s.drinks.forEach((d) => {
        typeCounts[d.type] = (typeCounts[d.type] || 0) + 1;
      });
    });
    const favoriteType = Object.entries(typeCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const typeEmojis = {
      beer: '🍺',
      wine: '🍷',
      cocktail: '🍹',
      shot: '🥃',
      other: '🥤',
    };

    setYearStats({
      totalDrinks,
      totalSessions,
      totalSpent,
      longestDuration,
      biggestSessionDrinks: biggestSession.drinks.length,
      topDrink,
      busiestMonth: {
        name: monthNames[parseInt(busiestMonth[0])],
        count: busiestMonth[1],
      },
      favoriteType: {
        type: favoriteType[0],
        emoji: typeEmojis[favoriteType[0]],
        count: favoriteType[1],
      },
      averagePerSession: (totalDrinks / totalSessions).toFixed(1),
    });
  };

  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const RecapCard = ({ title, value, subtitle, emoji, color }) => (
    <View style={[styles.recapCard, { backgroundColor: color || theme.primary }]}>
      {emoji && <Text style={styles.recapEmoji}>{emoji}</Text>}
      <Text style={styles.recapTitle}>{title}</Text>
      <Text style={styles.recapValue}>{value}</Text>
      {subtitle && <Text style={styles.recapSubtitle}>{subtitle}</Text>}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 16,
    },
    headerCard: {
      backgroundColor: theme.primary,
      borderRadius: 20,
      padding: 30,
      alignItems: 'center',
      marginBottom: 24,
    },
    headerYear: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    recapCard: {
      borderRadius: 20,
      padding: 30,
      marginBottom: 16,
      alignItems: 'center',
      minHeight: 200,
      justifyContent: 'center',
    },
    recapEmoji: {
      fontSize: 60,
      marginBottom: 16,
    },
    recapTitle: {
      fontSize: 18,
      color: '#FFFFFF',
      opacity: 0.9,
      marginBottom: 12,
      textAlign: 'center',
    },
    recapValue: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
      textAlign: 'center',
    },
    recapSubtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.85,
      textAlign: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 18,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    shareButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 40,
    },
    shareButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  if (!yearStats) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No data for {currentYear} yet! 📊
          </Text>
          <Text style={styles.emptySubtext}>
            Start logging your sessions to see your yearly recap.
          </Text>
        </View>
      </View>
    );
  }

  const colors = [
    theme.primary,
    '#9C27B0',
    '#E91E63',
    '#FF5722',
    '#FF9800',
    '#4CAF50',
    '#2196F3',
    '#00BCD4',
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.headerCard}>
          <Text style={styles.headerYear}>{currentYear}</Text>
          <Text style={styles.headerTitle}>Your Year in Pints</Text>
          <Text style={styles.headerSubtitle}>Here's how you tracked</Text>
        </View>

        <RecapCard
          title="You had"
          value={yearStats.totalDrinks}
          subtitle={`drinks in ${yearStats.totalSessions} sessions`}
          emoji="🎉"
          color={colors[0]}
        />

        <RecapCard
          title="Your Top Drink"
          value={yearStats.topDrink[0]}
          subtitle={`Had it ${yearStats.topDrink[1]} times`}
          emoji="🏆"
          color={colors[1]}
        />

        <RecapCard
          title="Longest Night"
          value={formatDuration(yearStats.longestDuration)}
          subtitle="That's dedication!"
          emoji="⏰"
          color={colors[2]}
        />

        <RecapCard
          title="Biggest Session"
          value={yearStats.biggestSessionDrinks}
          subtitle="drinks in one night"
          emoji="🔥"
          color={colors[3]}
        />

        <RecapCard
          title="Busiest Month"
          value={yearStats.busiestMonth.name}
          subtitle={`${yearStats.busiestMonth.count} drinks`}
          emoji="📅"
          color={colors[4]}
        />

        <RecapCard
          title="Favorite Type"
          value={yearStats.favoriteType.type.charAt(0).toUpperCase() + yearStats.favoriteType.type.slice(1)}
          subtitle={`${yearStats.favoriteType.count} times`}
          emoji={yearStats.favoriteType.emoji}
          color={colors[5]}
        />

        <RecapCard
          title="Average Per Session"
          value={yearStats.averagePerSession}
          subtitle="drinks per night out"
          emoji="📊"
          color={colors[6]}
        />

        {yearStats.totalSpent > 0 && (
          <RecapCard
            title="Total Spent"
            value={`$${yearStats.totalSpent.toFixed(0)}`}
            subtitle="on tracked drinks"
            emoji="💰"
            color={colors[7]}
          />
        )}

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>📸 Share Your Recap</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RecapScreen;
