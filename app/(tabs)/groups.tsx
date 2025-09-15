import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

const groupsData = [
  {
    id: '1',
    name: 'Fitness Buddies',
    members: 24,
    activeMembers: 12,
    icon: 'fitness',
    color: '#FF6B9D',
    description: 'Daily workout motivation and tips',
  },
  {
    id: '2',
    name: 'Mindful Moments',
    members: 18,
    activeMembers: 8,
    icon: 'leaf',
    color: '#4CAF50',
    description: 'Meditation and mindfulness practice',
  },
  {
    id: '3',
    name: 'Healthy Eaters',
    members: 32,
    activeMembers: 15,
    icon: 'nutrition',
    color: '#FF9800',
    description: 'Nutrition tips and healthy recipes',
  },
  {
    id: '4',
    name: 'Sleep Squad',
    members: 16,
    activeMembers: 6,
    icon: 'moon',
    color: '#9C27B0',
    description: 'Better sleep habits and routines',
  },
];

export default function GroupsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderGroupCard = ({ item }: { item: typeof groupsData[0] }) => (
    <TouchableOpacity style={[styles.groupCard, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.groupHeader}>
        <View style={[styles.groupIcon, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon as any} size={24} color="white" />
        </View>
        <View style={styles.groupInfo}>
          <Text style={[styles.groupName, { color: colors.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.groupDescription, { color: colors.textSecondary }]}>{item.description}</Text>
          <View style={styles.memberInfo}>
            <Text style={[styles.memberCount, { color: colors.success }]}>{item.activeMembers} active</Text>
            <Text style={[styles.totalMembers, { color: colors.textSecondary }]}>• {item.members} total members</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.chatButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/chat')}
        >
          <Ionicons name="chatbubble" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Groups</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Active Groups */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>My Groups</Text>
        <FlatList
          data={groupsData}
          renderItem={renderGroupCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Group Activity</Text>
        <View style={[styles.statsCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>47</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Messages Today</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Friends</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>8</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Challenges</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Activity</Text>
        <View style={[styles.activityCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: colors.success }]}>
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityText, { color: colors.textPrimary }]}>
                <Text style={[styles.activityUser, { color: colors.primary }]}>Emma</Text> completed her morning workout
              </Text>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>2 minutes ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: colors.warning }]}>
              <Ionicons name="restaurant" size={16} color="white" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityText, { color: colors.textPrimary }]}>
                <Text style={[styles.activityUser, { color: colors.primary }]}>Sarah</Text> shared a healthy recipe
              </Text>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>15 minutes ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="trophy" size={16} color="white" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityText, { color: colors.textPrimary }]}>
                <Text style={[styles.activityUser, { color: colors.primary }]}>Mike</Text> reached his step goal
              </Text>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>1 hour ago</Text>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  groupCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  groupDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  totalMembers: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  chatButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityUser: {
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});
