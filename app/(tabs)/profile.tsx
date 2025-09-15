import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

const menuItems = [
  {
    id: '1',
    title: 'Account',
    icon: 'person-outline',
    hasArrow: true,
  },
  {
    id: '2',
    title: 'Terms and Conditions',
    icon: 'document-text-outline',
    hasArrow: true,
  },
  {
    id: '3',
    title: 'Privacy Policy',
    icon: 'shield-checkmark-outline',
    hasArrow: true,
  },
  {
    id: '4',
    title: 'Support Email',
    icon: 'mail-outline',
    hasArrow: true,
  },
  {
    id: '5',
    title: 'Feature Requests',
    icon: 'bulb-outline',
    hasArrow: true,
  },
  {
    id: '6',
    title: 'Sync Data',
    icon: 'sync-outline',
    subtitle: 'Last Sync: 5:32 PM',
    hasArrow: true,
  },
  {
    id: '7',
    title: 'Delete Account',
    icon: 'trash-outline',
    hasArrow: true,
    isDestructive: true,
  },
  {
    id: '8',
    title: 'Logout',
    icon: 'log-out-outline',
    hasArrow: false,
    isDestructive: true,
  },
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleMenuPress = (item: any) => {
    if (item.id === '7') {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive' }
        ]
      );
    } else if (item.id === '8') {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive' }
        ]
      );
    }
  };

  const renderMenuItem = (item: any) => (
    <TouchableOpacity 
      key={item.id} 
      style={[styles.menuItem, { backgroundColor: cardBackground }]}
      onPress={() => handleMenuPress(item)}
    >
      <View style={styles.menuItemContent}>
        <Ionicons 
          name={item.icon as any} 
          size={20} 
          color={item.destructive ? '#EF4444' : textColor} 
        />
        <Text style={[styles.menuItemText, { 
          color: item.destructive ? '#EF4444' : textColor 
        }]}>
          {item.title}
        </Text>
      </View>
      {item.hasArrow && (
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.section}>
        <View style={[styles.profileCard, { backgroundColor: cardBackground }]}>
          <View style={styles.profileInfo}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>S</Text>
            </View>
            <View style={styles.profileText}>
              <Text style={[styles.profileName, { color: textColor }]}>Sarah Johnson</Text>
              <Text style={styles.profileEmail}>sarah.johnson@email.com</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={16} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.section}>
        <View style={[styles.statsCard, { backgroundColor: cardBackground }]}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Total Check-ins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Groups Joined</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileCard: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#E91E63',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  menuContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
