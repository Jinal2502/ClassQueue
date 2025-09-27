// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseHelpers } from '../utils/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'student' or 'teacher'

  useEffect(() => {
    // Check current session
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setUserRole(session.user.user_metadata?.role || 'student');
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setUserRole(user.user_metadata?.role || 'student');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, role = 'student', fullName = '') => {
    try {
      setLoading(true);
      const { data, error } = await supabaseHelpers.signUp(email, password, {
        role,
        full_name: fullName
      });

      if (error) throw error;

      // After signup, we might need to create a profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              role: role
            }
          ]);
        
        if (profileError && profileError.code !== '23505') { // Ignore duplicate key errors
          console.error('Profile creation error:', profileError);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabaseHelpers.signIn(email, password);
      
      if (error) throw error;
      
      if (data.user) {
        setUser(data.user);
        setUserRole(data.user.user_metadata?.role || 'student');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabaseHelpers.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserRole(null);
      return { error: null };
    } catch (error) {
      console.error('Signout error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = () => {
    return userRole === 'teacher';
  };

  const isStudent = () => {
    return userRole === 'student';
  };

  const value = {
    user,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    isTeacher,
    isStudent
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};