import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  streak_count: number;
  total_checkins: number;
  plant_evolution_stage: number;
  current_mood: MoodType;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  member_count: number;
  is_private: boolean;
}

export interface Activity {
  id: string;
  user_id: string;
  type: ActivityType;
  title: string;
  description?: string;
  duration_minutes?: number;
  intensity?: number;
  mood_before?: MoodType;
  mood_after?: MoodType;
  notes?: string;
  created_at: string;
  completed_at?: string;
  is_completed: boolean;
}

export interface DailyGoal {
  id: string;
  user_id: string;
  date: string;
  steps_goal: number;
  steps_current: number;
  water_goal: number;
  water_current: number;
  sleep_goal_hours: number;
  sleep_actual_hours: number;
  workout_goal_minutes: number;
  workout_actual_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  message_type: string;
  reply_to?: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  profiles?: Profile;
}

export interface Achievement {
  id: string;
  user_id: string;
  type: AchievementType;
  title: string;
  description?: string;
  icon?: string;
  color: string;
  earned_at: string;
  value?: number;
  is_featured: boolean;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: MoodType;
  intensity: number;
  notes?: string;
  created_at: string;
  date: string;
}

export type MoodType = 'happy' | 'sad' | 'tired' | 'energetic' | 'stressed' | 'calm' | 'excited' | 'anxious';
export type ActivityType = 'workout' | 'meditation' | 'sleep' | 'nutrition' | 'social' | 'learning' | 'hobby';
export type AchievementType = 'streak' | 'milestone' | 'social' | 'personal';

// Helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as Profile;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Profile;
};

export const getUserGroups = async (userId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      groups (*)
    `)
    .eq('user_id', userId)
    .eq('is_active', true);
  
  if (error) throw error;
  return data.map(item => item.groups) as Group[];
};

export const getGroupMessages = async (groupId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url,
        username
      )
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data as Message[];
};

export const sendMessage = async (groupId: string, userId: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      group_id: groupId,
      user_id: userId,
      content,
      message_type: 'text'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Message;
};

export const getUserActivities = async (userId: string, limit = 20) => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data as Activity[];
};

export const createActivity = async (activity: Omit<Activity, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single();
  
  if (error) throw error;
  return data as Activity;
};

export const getDailyGoals = async (userId: string, date: string) => {
  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data as DailyGoal | null;
};

export const updateDailyGoals = async (userId: string, date: string, updates: Partial<DailyGoal>) => {
  const { data, error } = await supabase
    .from('daily_goals')
    .upsert({
      user_id: userId,
      date,
      ...updates
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as DailyGoal;
};

export const getUserAchievements = async (userId: string) => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });
  
  if (error) throw error;
  return data as Achievement[];
};

export const createMoodEntry = async (userId: string, mood: MoodType, intensity: number, notes?: string) => {
  const { data, error } = await supabase
    .from('mood_entries')
    .insert({
      user_id: userId,
      mood,
      intensity,
      notes,
      date: new Date().toISOString().split('T')[0]
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as MoodEntry;
};

export const getMoodEntries = async (userId: string, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data as MoodEntry[];
};

// Real-time subscriptions
export const subscribeToGroupMessages = (groupId: string, callback: (message: Message) => void) => {
  return supabase
    .channel(`group-${groupId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `group_id=eq.${groupId}`
      },
      async (payload) => {
        // Fetch the complete message with profile data
        const { data } = await supabase
          .from('messages')
          .select(`
            *,
            profiles (
              id,
              full_name,
              avatar_url,
              username
            )
          `)
          .eq('id', payload.new.id)
          .single();
        
        if (data) {
          callback(data as Message);
        }
      }
    )
    .subscribe();
};

export const subscribeToUserActivities = (userId: string, callback: (activity: Activity) => void) => {
  return supabase
    .channel(`user-activities-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'activities',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new as Activity);
      }
    )
    .subscribe();
};
