import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  email: string;
  name: string;
  credits: number;
  credits_used: number;
  plan: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper: Ensure a profile row exists for the user
  const ensureProfileExists = async (userId: string, email: string) => {
    try {
      // Check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116: No rows found
      if (!data) {
        // Insert a new profile row with default values
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email,
            name: email.split('@')[0],
            credits: 10,
            credits_used: 0,
            plan: 'Free',
            created_at: new Date().toISOString(),
          });
        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error('Error ensuring profile exists:', err);
    }
  };

  // Helper: Insert a project row after successful humanization
  const insertProject = async (userId: string, inputText: string, outputText: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          input_text: inputText,
          output_text: outputText,
          created_at: new Date().toISOString(),
        });
      if (error) throw error;
    } catch (err) {
      console.error('Error inserting project:', err);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.id && user.email) {
      ensureProfileExists(user.id, user.email);
    }
  }, [user]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const updateProfile = async (updatedProfile: Profile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', updatedProfile.id);
      if (error) throw error;
      // Always fetch the latest profile from Supabase after update
      await refreshProfile(updatedProfile.id);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};