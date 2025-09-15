import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { supabase, getCurrentUser, getProfile, getDailyGoals, updateDailyGoals, createMoodEntry, MoodType, Profile, DailyGoal } from '@/lib/supabase';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const userProfile = await getProfile(user.id);
        setProfile(userProfile);
        
        const today = new Date().toISOString().split('T')[0];
        const goals = await getDailyGoals(user.id, today);
        setDailyGoals(goals);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelection = async (mood: MoodType) => {
    if (!profile) return;
    
    try {
      setSelectedMood(mood);
      await createMoodEntry(profile.id, mood, 3); // Default intensity
      Alert.alert('Mood Logged', `Thanks for sharing that you're feeling ${mood}!`);
    } catch (error) {
      console.error('Error logging mood:', error);
      Alert.alert('Error', 'Failed to log mood. Please try again.');
    }
  };

  const handleLogActivity = () => {
    Alert.alert(
      'Log Activity',
      'What would you like to log?',
      [
        { text: 'Workout', onPress: () => logActivity('workout') },
        { text: 'Meditation', onPress: () => logActivity('meditation') },
        { text: 'Sleep', onPress: () => logActivity('sleep') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const logActivity = async (type: string) => {
    if (!profile) return;
    
    try {
      // This would typically open a detailed activity logging screen
      Alert.alert('Activity Logged', `${type} activity has been logged!`);
      loadUserData(); // Refresh data
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const updateGoalProgress = async (goalType: string, increment: number) => {
    if (!profile || !dailyGoals) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      let updates: Partial<DailyGoal> = {};
      
      switch (goalType) {
        case 'steps':
          updates.steps_current = Math.min((dailyGoals.steps_current || 0) + increment, dailyGoals.steps_goal);
          break;
        case 'water':
          updates.water_current = Math.min((dailyGoals.water_current || 0) + increment, dailyGoals.water_goal);
          break;
      }
      
      const updatedGoals = await updateDailyGoals(profile.id, today, updates);
      setDailyGoals(updatedGoals);
    } catch (error) {
      console.error('Error updating goals:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textPrimary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>S</Text>
          </View>
          <View style={styles.welcomeText}>
            <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>Welcome back, {profile?.full_name || 'User'}!</Text>
            <Text style={styles.welcomeSubtitle}>Day {profile?.streak_count || 0} of your journey</Text>
          </View>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color="#FF6B35" />
          <Text style={styles.streakText}>{profile?.streak_count || 0} days</Text>
        </View>
      </View>

      {/* Check-ins Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Check-ins</Text>
        <View style={styles.checkInRow}>
          <TouchableOpacity 
            style={[styles.checkInCard, styles.logActivityCard]}
            onPress={handleLogActivity}
          >
            <View style={styles.checkInIcon}>
              <Ionicons name="checkmark" size={24} color="white" />
            </View>
            <Text style={styles.checkInLabel}>Log Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.checkInCard, styles.feelingCard]}
            onPress={() => setSelectedMood(selectedMood ? null : 'happy')}
          >
            <View style={styles.feelingIcon}>
              <Text style={styles.feelingEmoji}>😴</Text>
            </View>
            <Text style={styles.checkInLabel}>Feeling: {selectedMood || 'Tap to set'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>This Week's Progress</Text>
        <View style={[styles.progressCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Check-ins completed</Text>
            <Text style={styles.progressCount}>{profile?.total_checkins || 0}/{(profile?.total_checkins || 0) + 3}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(((profile?.total_checkins || 0) / ((profile?.total_checkins || 0) + 3)) * 100, 100)}%` }]} />
            </View>
          </View>
          <Text style={styles.progressMessage}>{(profile?.total_checkins || 0) > 10 ? "Great job! You're on track" : "Keep going! You're doing great"}</Text>
        </View>
      </View>

      {/* Emotional State Chart */}
      <View style={styles.section}>
        <View style={[styles.chartCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.chartTitle, { color: colors.textPrimary }]}>Emotional State Chart</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartDays}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                <View key={month} style={styles.chartDay}>
                  <View style={[styles.chartBar, { height: Math.random() * 40 + 20 }]} />
                  <Text style={styles.chartDayLabel}>{month}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Group Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Group Activity Today</Text>
          <TouchableOpacity onPress={() => router.push('/groups')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.avatarRow}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>U</Text>
              {index < 2 && <View style={styles.activeIndicator} />}
            </View>
          ))}
        </View>
      </View>

      {/* My Groups */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>My Groups</Text>
        <TouchableOpacity 
          style={styles.groupCard}
          onPress={() => router.push('/groups')}
        >
          <View style={styles.groupHeader}>
            <View style={styles.groupIcon}>
              <Ionicons name="fitness" size={20} color={colors.primary} />
            </View>
            <View style={styles.groupInfo}>
              <Text style={[styles.groupName, { color: colors.textPrimary }]}>Fitness Buddies</Text>
              <Text style={styles.groupMembers}>24 members active</Text>
            </View>
            <Text style={styles.memberCount}>+21</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Health Status */}
      <View style={styles.section}>
        <View style={styles.healthRow}>
          <View style={[styles.healthCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={styles.healthLabel}>Health: Healthy</Text>
            <Text style={styles.healthLabel}>Evolution: Baby Plant</Text>
            <Text style={styles.healthLabel}>Mood: Happy</Text>
          </View>
          <View style={styles.plantContainer}>
            <View style={styles.plantPot}>
              <Text style={styles.plantEmoji}>🌱</Text>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#E91E63',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkInRow: {
    flexDirection: 'row',
    gap: 15,
  },
  checkInCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  logActivityCard: {
    backgroundColor: '#10B981',
  },
  feelingCard: {
    backgroundColor: '#F8BBD9',
  },
  checkInIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  feelingIcon: {
    marginBottom: 8,
  },
  feelingEmoji: {
    fontSize: 32,
  },
  checkInLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 4,
  },
  progressMessage: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  chartCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  chartContainer: {
    height: 100,
  },
  chartDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  chartDay: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 20,
    backgroundColor: '#F8BBD9',
    borderRadius: 10,
    marginBottom: 8,
  },
  chartDayLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  groupCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCE7F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  groupMembers: {
    fontSize: 12,
    color: '#6B7280',
  },
  memberCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E91E63',
  },
  healthRow: {
    flexDirection: 'row',
    gap: 15,
  },
  healthCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  healthLabel: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 4,
    fontWeight: '500',
  },
  plantContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantPot: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F8BBD9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantEmoji: {
    fontSize: 40,
  },
});
