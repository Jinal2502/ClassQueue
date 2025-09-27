// src/pages/TeacherDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDoubts } from '../context/DoubtContext';
import QueueDisplay from '../components/QueueDisplay';
import QueueVisualizer from '../components/QueueVisualizer';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { 
    generalQueue, 
    priorityQueue, 
    stats, 
    resolveDoubt, 
    getNextDoubt,
    refreshDoubts,
    loading 
  } = useDoubts();
  
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [answer, setAnswer] = useState('');
  const [resolving, setResolving] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    refreshDoubts();
  }, []);

  const handleResolve = (doubt) => {
    setSelectedDoubt(doubt);
    setShowResolveModal(true);
    setAnswer('');
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !selectedDoubt) return;
    
    setResolving(true);
    try {
      const { success } = await resolveDoubt(selectedDoubt.id, answer);
      
      if (success) {
        setLastAction({ type: 'dequeue', timestamp: Date.now() });
        setShowResolveModal(false);
        setSelectedDoubt(null);
        setAnswer('');
      }
    } catch (error) {
      console.error('Error resolving doubt:', error);
    } finally {
      setResolving(false);
    }
  };

  const nextDoubt = getNextDoubt();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalPending = stats.pending || 0;
  const resolutionRate = stats.total > 0 ? ((stats.answered / stats.total) * 100).toFixed(0) : 0;
  const avgWaitTime = totalPending * 3; // Mock calculation

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Manage student doubts efficiently</p>
            </div>
            <button
              onClick={refreshDoubts}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Total Pending</span>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-3xl font-bold text-white">{totalPending}</p>
            <p className="text-xs text-gray-600 mt-1">
              {stats.priorityPending} priority, {stats.generalPending} general
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Resolved Today</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.answered}</p>
            <p className="text-xs text-green-500 mt-1">+{resolutionRate}% resolution rate</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Avg Wait Time</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-white">{avgWaitTime}</p>
            <p className="text-xs text-gray-600 mt-1">minutes</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Queue Status</span>
              <div className={`w-2 h-2 rounded-full ${
                totalPending > 5 ? 'bg-orange-500' : 'bg-green-500'
              }`}></div>
            </div>
            <p className="text-3xl font-bold text-white">
              {totalPending > 5 ? 'Busy' : totalPending > 0 ? 'Active' : 'Idle'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {totalPending > 5 ? 'High load' : 'Normal operation'}
            </p>
          </div>
        </div>

        {/* Next Doubt Alert */}
        {nextDoubt && (
          <div className="mb-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">NEXT IN QUEUE</p>
                  <p className="text-sm font-medium text-white">{nextDoubt.title}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    {nextDoubt.is_priority && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
                        Priority
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      by {nextDoubt.student_name || nextDoubt.student_email}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleResolve(nextDoubt)}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                Resolve Now
              </button>
            </div>
          </div>
        )}

        {/* Activity Chart Placeholder */}
        <div className="mb-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-100">Queue Activity</h3>
            <span className="text-xs text-gray-500">Last 24 hours</span>
          </div>
          <div className="h-20 flex items-end space-x-1">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gray-800 rounded-sm hover:bg-blue-500/30 transition-colors"
                style={{ height: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Queue Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <QueueVisualizer 
            queue={priorityQueue} 
            type="priority" 
            lastAction={lastAction}
          />
          <QueueVisualizer 
            queue={generalQueue} 
            type="general" 
            lastAction={lastAction}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QueueDisplay
            title="PRIORITY QUEUE"
            queue={priorityQueue}
            type="priority"
            onResolve={handleResolve}
            emptyMessage="No priority doubts"
          />
          <QueueDisplay
            title="GENERAL QUEUE"
            queue={generalQueue}
            type="general"
            onResolve={handleResolve}
            emptyMessage="No general doubts"
          />
        </div>

        {/* Resolve Modal */}
        {showResolveModal && selectedDoubt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white">Resolve Doubt</h2>
                  <button
                    onClick={() => setShowResolveModal(false)}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Doubt Details */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    {selectedDoubt.is_priority && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
                        Priority
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {selectedDoubt.student_name || selectedDoubt.student_email}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-white mb-2">
                    {selectedDoubt.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {selectedDoubt.description}
                  </p>
                </div>

                {/* Answer Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Answer
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    placeholder="Type your answer here..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-800 flex justify-end space-x-3">
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={!answer.trim() || resolving}
                  className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resolving ? 'Submitting...' : 'Submit Answer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;