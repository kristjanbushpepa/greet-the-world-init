import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';

const chatMessages = [
  {
    id: '1',
    user: 'Sarah',
    time: '9:31 AM',
    message: 'Good morning everyone! Ready for today\'s workout? 💪',
    isOwn: true,
    avatar: 'S',
  },
  {
    id: '2',
    user: 'Mike',
    time: '9:32 AM',
    message: 'Amazing! I\'m heading to the gym now 🏃‍♂️',
    isOwn: false,
    avatar: 'M',
  },
  {
    id: '3',
    user: 'Emma',
    time: '9:35 AM',
    message: 'You guys are so motivating! Can\'t wait for my evening yoga session 🧘‍♀️',
    isOwn: false,
    avatar: 'E',
  },
];

export default function ChatScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const cardBackground = useThemeColor({}, 'cardBackground');
  
  const [message, setMessage] = useState('');

  const renderMessage = ({ item }: { item: typeof chatMessages[0] }) => (
    <View style={[styles.messageContainer, item.isOwn && styles.ownMessageContainer]}>
      {!item.isOwn && (
        <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
      )}
      <View style={[
        styles.messageBubble, 
        { backgroundColor: item.isOwn ? primaryColor : cardBackground },
        item.isOwn && styles.ownMessageBubble
      ]}>
        {!item.isOwn && (
          <Text style={[styles.userName, { color: primaryColor }]}>{item.user}</Text>
        )}
        <Text style={[
          styles.messageText, 
          { color: item.isOwn ? 'white' : textColor }
        ]}>
          {item.message}
        </Text>
        <Text style={[
          styles.messageTime, 
          { color: item.isOwn ? 'rgba(255,255,255,0.7)' : '#8E8E93' }
        ]}>
          {item.time}
        </Text>
      </View>
      {item.isOwn && (
        <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
      )}
    </View>
  );

  const sendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBackground }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.groupName, { color: textColor }]}>Fitness Squad</Text>
          <Text style={styles.memberCount}>4 members</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Progress Banner */}
      <View style={[styles.progressBanner, { backgroundColor: '#FFF0F3' }]}>
        <View style={styles.progressContent}>
          <Text style={styles.progressTitle}>Progress</Text>
          <Text style={styles.progressSubtitle}>+8% from completed</Text>
        </View>
        <View style={styles.avatarGroup}>
          {['S', 'M', 'E', 'A'].map((initial, index) => (
            <View key={index} style={[styles.smallAvatar, { backgroundColor: primaryColor }]}>
              <Text style={styles.smallAvatarText}>{initial}</Text>
              {index < 2 && <View style={styles.activeIndicator} />}
            </View>
          ))}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: cardBackground }]}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TextInput
          style={[styles.textInput, { color: textColor }]}
          placeholder="Type a message..."
          placeholderTextColor="#8E8E93"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: primaryColor }]}
          onPress={sendMessage}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
  },
  memberCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  moreButton: {
    padding: 4,
  },
  progressBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
  },
  progressContent: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
    marginBottom: 2,
  },
  progressSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  avatarGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  smallAvatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  ownMessageBubble: {
    borderBottomRightRadius: 6,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  attachButton: {
    marginRight: 12,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 8,
  },
});
