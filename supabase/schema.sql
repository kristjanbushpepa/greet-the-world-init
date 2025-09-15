-- BlossomSquad Database Schema
-- This file contains all the SQL commands to set up the database structure

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create custom types
CREATE TYPE mood_type AS ENUM ('happy', 'sad', 'tired', 'energetic', 'stressed', 'calm', 'excited', 'anxious');
CREATE TYPE activity_type AS ENUM ('workout', 'meditation', 'sleep', 'nutrition', 'social', 'learning', 'hobby');
CREATE TYPE achievement_type AS ENUM ('streak', 'milestone', 'social', 'personal');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    streak_count INTEGER DEFAULT 0,
    total_checkins INTEGER DEFAULT 0,
    plant_evolution_stage INTEGER DEFAULT 1,
    current_mood mood_type DEFAULT 'happy'
);

-- Groups table
CREATE TABLE public.groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#FF6B9D',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    member_count INTEGER DEFAULT 0,
    is_private BOOLEAN DEFAULT FALSE
);

-- Group memberships
CREATE TABLE public.group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'admin', 'moderator', 'member'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(group_id, user_id)
);

-- Activities/Check-ins table
CREATE TABLE public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type activity_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
    mood_before mood_type,
    mood_after mood_type,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE
);

-- Daily goals table
CREATE TABLE public.daily_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    steps_goal INTEGER DEFAULT 10000,
    steps_current INTEGER DEFAULT 0,
    water_goal INTEGER DEFAULT 8, -- glasses
    water_current INTEGER DEFAULT 0,
    sleep_goal_hours DECIMAL(3,1) DEFAULT 8.0,
    sleep_actual_hours DECIMAL(3,1) DEFAULT 0,
    workout_goal_minutes INTEGER DEFAULT 30,
    workout_actual_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Messages table for group chats
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text', -- 'text', 'image', 'activity_share'
    reply_to UUID REFERENCES public.messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT FALSE
);

-- Achievements table
CREATE TABLE public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type achievement_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#FF6B9D',
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    value INTEGER, -- for milestone achievements (e.g., 7 for 7-day streak)
    is_featured BOOLEAN DEFAULT FALSE
);

-- Mood tracking table
CREATE TABLE public.mood_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mood mood_type NOT NULL,
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date DATE DEFAULT CURRENT_DATE
);

-- Progress snapshots (weekly/monthly summaries)
CREATE TABLE public.progress_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    period_type TEXT NOT NULL, -- 'week', 'month'
    total_activities INTEGER DEFAULT 0,
    total_workout_minutes INTEGER DEFAULT 0,
    average_mood DECIMAL(3,2),
    streak_days INTEGER DEFAULT 0,
    achievements_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Groups policies
CREATE POLICY "Groups are viewable by members" ON public.groups
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can create groups" ON public.groups
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update groups" ON public.groups
    FOR UPDATE USING (
        id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Group members policies
CREATE POLICY "Group members are viewable by group members" ON public.group_members
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can join groups" ON public.group_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" ON public.group_members
    FOR UPDATE USING (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "Users can view their own activities" ON public.activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" ON public.activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" ON public.activities
    FOR UPDATE USING (auth.uid() = user_id);

-- Daily goals policies
CREATE POLICY "Users can view their own daily goals" ON public.daily_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily goals" ON public.daily_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily goals" ON public.daily_goals
    FOR UPDATE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Group members can view group messages" ON public.messages
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Group members can send messages" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view their own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements" ON public.achievements
    FOR INSERT WITH CHECK (true);

-- Mood entries policies
CREATE POLICY "Users can view their own mood entries" ON public.mood_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries" ON public.mood_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries" ON public.mood_entries
    FOR UPDATE USING (auth.uid() = user_id);

-- Progress snapshots policies
CREATE POLICY "Users can view their own progress snapshots" ON public.progress_snapshots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert progress snapshots" ON public.progress_snapshots
    FOR INSERT WITH CHECK (true);

-- Functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_goals_updated_at BEFORE UPDATE ON public.daily_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.groups 
        SET member_count = member_count + 1 
        WHERE id = NEW.group_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.groups 
        SET member_count = member_count - 1 
        WHERE id = OLD.group_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle active status changes
        IF OLD.is_active = true AND NEW.is_active = false THEN
            UPDATE public.groups 
            SET member_count = member_count - 1 
            WHERE id = NEW.group_id;
        ELSIF OLD.is_active = false AND NEW.is_active = true THEN
            UPDATE public.groups 
            SET member_count = member_count + 1 
            WHERE id = NEW.group_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for group member count
CREATE TRIGGER group_member_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.group_members
    FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Insert sample data for development
INSERT INTO public.groups (id, name, description, icon, color, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Fitness Buddies', 'Daily workout motivation and tips', 'fitness', '#FF6B9D', null),
    ('550e8400-e29b-41d4-a716-446655440002', 'Mindful Moments', 'Meditation and mindfulness practice', 'leaf', '#4CAF50', null),
    ('550e8400-e29b-41d4-a716-446655440003', 'Healthy Eaters', 'Nutrition tips and healthy recipes', 'nutrition', '#FF9800', null),
    ('550e8400-e29b-41d4-a716-446655440004', 'Sleep Squad', 'Better sleep habits and routines', 'moon', '#9C27B0', null);

-- Create indexes for better performance
CREATE INDEX idx_activities_user_id_created_at ON public.activities(user_id, created_at DESC);
CREATE INDEX idx_messages_group_id_created_at ON public.messages(group_id, created_at DESC);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_daily_goals_user_date ON public.daily_goals(user_id, date);
CREATE INDEX idx_mood_entries_user_date ON public.mood_entries(user_id, date DESC);
CREATE INDEX idx_achievements_user_earned ON public.achievements(user_id, earned_at DESC);
