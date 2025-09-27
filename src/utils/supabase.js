// src/utils/supabase.js

import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export const supabaseHelpers = {
  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  // Sign up new user
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Create doubt
  createDoubt: async (doubt) => {
    const { data, error } = await supabase
      .from('doubts')
      .insert([doubt])
      .select()
      .single();
    return { data, error };
  },

  // Get all doubts
  getDoubts: async () => {
    const { data, error } = await supabase
      .from('doubts')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Update doubt (resolve with answer)
  resolveDoubt: async (doubtId, answer, teacherId) => {
    const { data, error } = await supabase
      .from('doubts')
      .update({ 
        answer, 
        answered_by: teacherId,
        status: 'answered',
        answered_at: new Date().toISOString()
      })
      .eq('id', doubtId)
      .select()
      .single();
    return { data, error };
  },

  // Get pending doubts
  getPendingDoubts: async () => {
    const { data, error } = await supabase
      .from('doubts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    return { data, error };
  },

  // Subscribe to doubts changes
  subscribeToDoubts: (callback) => {
    const subscription = supabase
      .channel('doubts_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'doubts'
        },
        callback
      )
      .subscribe();
    
    return subscription;
  }
};

export default supabase;