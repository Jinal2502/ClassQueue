// src/context/DoubtContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseHelpers } from '../utils/supabase';
import { useAuth } from './AuthContext';
import Queue from '../ds-implementation/Queue';
import PriorityQueue from '../ds-implementation/PriorityQueue';

const DoubtContext = createContext({});

export const useDoubts = () => {
  const context = useContext(DoubtContext);
  if (!context) {
    throw new Error('useDoubts must be used within DoubtProvider');
  }
  return context;
};

export const DoubtProvider = ({ children }) => {
  const { user } = useAuth();
  
  // State for all doubts
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Queue instances
  const [generalQueue] = useState(new Queue());
  const [priorityQueue] = useState(new PriorityQueue());
  
  // Queue state for UI updates
  const [generalQueueItems, setGeneralQueueItems] = useState([]);
  const [priorityQueueItems, setPriorityQueueItems] = useState([]);
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    answered: 0,
    generalPending: 0,
    priorityPending: 0
  });

  // Load doubts on mount and when user changes
  useEffect(() => {
    if (user) {
      loadDoubts();
      
      // Subscribe to real-time changes
      const subscription = supabaseHelpers.subscribeToDoubts((payload) => {
        handleRealtimeUpdate(payload);
      });

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  // Update queues when doubts change
  useEffect(() => {
    updateQueues();
    updateStats();
  }, [doubts]);

  const loadDoubts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseHelpers.getDoubts();
      
      if (error) throw error;
      
      setDoubts(data || []);
    } catch (error) {
      console.error('Error loading doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeUpdate = (payload) => {
    if (payload.eventType === 'INSERT') {
      setDoubts(prev => {
        // Check if doubt already exists to prevent duplicates
        const exists = prev.some(doubt => doubt.id === payload.new.id);
        if (exists) return prev;
        return [payload.new, ...prev];
      });
    } else if (payload.eventType === 'UPDATE') {
      setDoubts(prev => prev.map(doubt => 
        doubt.id === payload.new.id ? payload.new : doubt
      ));
    } else if (payload.eventType === 'DELETE') {
      setDoubts(prev => prev.filter(doubt => doubt.id !== payload.old.id));
    }
  };

  const updateQueues = () => {
    // Clear queues
    generalQueue.clear();
    priorityQueue.clear();
    
    // Get pending doubts and sort by created_at (oldest first for FIFO)
    const pendingDoubts = doubts
      .filter(d => d.status === 'pending')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // OLDEST FIRST for FIFO
    
    // Separate and add to queues
    const generalDoubts = [];
    const priorityDoubts = [];
    
    pendingDoubts.forEach(doubt => {
      if (doubt.is_priority) {
        priorityDoubts.push(doubt);
        priorityQueue.enqueue(doubt, doubt.priority || 1);
      } else {
        generalDoubts.push(doubt);
        generalQueue.enqueue(doubt);
      }
    });
    
    // Update UI state
    setGeneralQueueItems(generalQueue.getItems());
    setPriorityQueueItems(priorityQueue.getItems());
  };

  const updateStats = () => {
    const pending = doubts.filter(d => d.status === 'pending');
    const answered = doubts.filter(d => d.status === 'answered');
    
    setStats({
      total: doubts.length,
      pending: pending.length,
      answered: answered.length,
      generalPending: pending.filter(d => !d.is_priority).length,
      priorityPending: pending.filter(d => d.is_priority).length
    });
  };

  const createDoubt = async (title, description, isPriority = false) => {
    try {
      const newDoubt = {
        title,
        description,
        is_priority: isPriority,
        priority: isPriority ? 1 : 2,
        status: 'pending',
        student_id: user.id,
        student_email: user.email,
        student_name: user.user_metadata?.full_name || user.email,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabaseHelpers.createDoubt(newDoubt);
      
      if (error) throw error;
      
      // Don't add to state here - let the realtime subscription handle it
      // This prevents duplicates
      return { success: true, data };
    } catch (error) {
      console.error('Error creating doubt:', error);
      return { success: false, error };
    }
  };

  const resolveDoubt = async (doubtId, answer) => {
    try {
      // Find the doubt to determine which queue to dequeue from
      const doubt = doubts.find(d => d.id === doubtId);
      if (!doubt) throw new Error('Doubt not found');
      
      // Update in database
      const { data, error } = await supabaseHelpers.resolveDoubt(
        doubtId, 
        answer, 
        user.id
      );
      
      if (error) throw error;
      
      // Dequeue from appropriate queue
      if (doubt.is_priority) {
        priorityQueue.dequeue();
        setPriorityQueueItems(priorityQueue.getItems());
      } else {
        generalQueue.dequeue();
        setGeneralQueueItems(generalQueue.getItems());
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error resolving doubt:', error);
      return { success: false, error };
    }
  };

  const getNextDoubt = () => {
    // Priority queue takes precedence
    if (!priorityQueue.isEmpty()) {
      return priorityQueue.front();
    }
    if (!generalQueue.isEmpty()) {
      return generalQueue.front();
    }
    return null;
  };

  const refreshDoubts = () => {
    loadDoubts();
  };

  const value = {
    doubts,
    loading,
    stats,
    generalQueue: generalQueueItems,
    priorityQueue: priorityQueueItems,
    createDoubt,
    resolveDoubt,
    getNextDoubt,
    refreshDoubts
  };

  return (
    <DoubtContext.Provider value={value}>
      {children}
    </DoubtContext.Provider>
  );
};