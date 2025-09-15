import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Progress</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Weekly Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>This Week</Text>
        <View style={[styles.statsCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>18</Text>
              <Text style={styles.statLabel}>Check-ins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>5</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>7.5</Text>
              <Text style={styles.statLabel}>Hours Sleep</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Mood Tracking */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Mood Tracking</Text>
        <View style={[styles.moodCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.moodRow}>
            {['😊', '😌', '😴', '😔', '😡'].map((emoji, index) => (
              <TouchableOpacity key={index} style={[styles.moodButton, { backgroundColor: colors.accent }]}>
                <Text style={styles.moodEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.moodLabel, { color: colors.textSecondary }]}>How are you feeling today?</Text>
        </View>
      </View>

      {/* Activity Goals */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Activity Goals</Text>
        <View style={[styles.goalCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.goalItem}>
            <View style={styles.goalInfo}>
              <Text style={[styles.goalTitle, { color: colors.textPrimary }]}>Daily Steps</Text>
              <Text style={[styles.goalProgress, { color: colors.textSecondary }]}>7,234 / 10,000</Text>
            </View>
            <View style={styles.goalBar}>
              <View style={[styles.goalFill, { width: '72%', backgroundColor: colors.primary }]} />
            </View>
          </View>
          
          <View style={styles.goalItem}>
            <View style={styles.goalInfo}>
              <Text style={[styles.goalTitle, { color: colors.textPrimary }]}>Water Intake</Text>
              <Text style={[styles.goalProgress, { color: colors.textSecondary }]}>6 / 8 glasses</Text>
            </View>
            <View style={styles.goalBar}>
              <View style={[styles.goalFill, { width: '75%', backgroundColor: colors.info }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Achievements</Text>
        <View style={[styles.achievementCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.achievement}>
            <View style={[styles.achievementIcon, { backgroundColor: colors.warning }]}>
              <Ionicons name="trophy" size={20} color="white" />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { color: colors.textPrimary }]}>7-Day Streak</Text>
              <Text style={[styles.achievementDesc, { color: colors.textSecondary }]}>Completed daily check-ins for a week!</Text>
            </View>
          </View>
          
          <View style={styles.achievement}>
            <View style={[styles.achievementIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="fitness" size={20} color="white" />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { color: colors.textPrimary }]}>Workout Warrior</Text>
              <Text style={[styles.achievementDesc, { color: colors.textSecondary }]}>Completed 5 workouts this week</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  moodCard: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  moodButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  goalCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalItem: {
    marginBottom: 20,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalProgress: {
    fontSize: 14,
    color: '#6B7280',
  },
  goalBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
});
