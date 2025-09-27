// src/pages/Timeline.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDoubts } from '../context/DoubtContext';
import DoubtCard from '../components/DoubtCard';
import StatsCard from '../components/StatsCard';

const Timeline = () => {
  const { user, isTeacher } = useAuth();
  const { doubts, loading, stats, refreshDoubts } = useDoubts();
  const [filter, setFilter] = useState('all'); // all, answered, pending
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest

  const filteredDoubts = doubts
    .filter(doubt => {
      if (filter === 'answered') return doubt.status === 'answered';
      if (filter === 'pending') return doubt.status === 'pending';
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });

  useEffect(() => {
    // Refresh doubts when component mounts
    refreshDoubts();
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm">Loading doubts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24 py-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header Section - Full Width */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Doubt Timeline</h1>
            <p className="text-base text-gray-400">
              Welcome back, {user?.user_metadata?.full_name || user?.email}! 
              Here's the latest from your classroom.
            </p>
          </div>

          {/* Statistics Section - Wider Layout */}
          {isTeacher() && (
            <div className="mb-10">
              <StatsCard stats={stats} />
            </div>
          )}

          {/* Student Dashboard - Creative Layout */}
          {!isTeacher() && (
            <div className="mb-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Your Doubts - Larger Card */}
                <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Your Total</span>
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">
                      {doubts.filter(d => d.student_id === user?.id).length}
                    </p>
                    <p className="text-sm text-gray-500">Doubts asked</p>
                  </div>
                </div>

                {/* Resolved */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Resolved</span>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-4xl font-bold text-green-400">
                      {doubts.filter(d => d.student_id === user?.id && d.status === 'answered').length}
                    </p>
                    <p className="text-sm text-gray-500">Answered</p>
                  </div>
                </div>

                {/* Pending */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Your Pending</span>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-4xl font-bold text-yellow-400">
                      {doubts.filter(d => d.student_id === user?.id && d.status === 'pending').length}
                    </p>
                    <p className="text-sm text-gray-500">In queue</p>
                  </div>
                </div>

                {/* Class Queue Status */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Class Queue</span>
                      <div className={`w-3 h-3 rounded-full ${stats.pending > 0 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                    </div>
                    <p className="text-4xl font-bold text-white">
                      {stats.pending}
                    </p>
                    <p className="text-sm text-gray-500">Total pending</p>
                  </div>
                </div>
              </div>
              
              {/* Status Message - Full Width */}
              <div className="mt-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6">
                <p className="text-base text-gray-300 leading-relaxed">
                  {stats.pending > 0 ? (
                    <>
                      There are <span className="font-bold text-yellow-400 text-lg">{stats.pending}</span> doubts 
                      waiting to be resolved by teachers.
                      {doubts.filter(d => d.student_id === user?.id && d.status === 'pending').length > 0 && (
                        <span className="text-yellow-400 ml-1 font-medium">
                          Including {doubts.filter(d => d.student_id === user?.id && d.status === 'pending').length} of yours.
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-green-400 font-medium text-lg">All doubts have been resolved! 🎉</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Main Content Area with Sidebar Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters and Controls */}
            <div className="xl:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Filter Section */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Filter Doubts</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between ${
                        filter === 'all'
                          ? 'bg-gray-800 text-white border border-gray-700'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <span>All Doubts</span>
                      <span className="text-xs opacity-60">{doubts.length}</span>
                    </button>
                    <button
                      onClick={() => setFilter('pending')}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between ${
                        filter === 'pending'
                          ? 'bg-gray-800 text-white border border-gray-700'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <span>Pending</span>
                      <span className="text-xs opacity-60">{stats.pending}</span>
                    </button>
                    <button
                      onClick={() => setFilter('answered')}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between ${
                        filter === 'answered'
                          ? 'bg-gray-800 text-white border border-gray-700'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <span>Answered</span>
                      <span className="text-xs opacity-60">{stats.answered}</span>
                    </button>
                  </div>
                </div>

                {/* Sort and Actions */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Sort & Actions</h3>
                  <div className="space-y-3">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 text-gray-300 text-sm rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                    <button
                      onClick={refreshDoubts}
                      className="w-full px-4 py-3 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all text-sm font-medium"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Doubts List */}
            <div className="xl:col-span-3">
              <div className="space-y-6">
                {filteredDoubts.length === 0 ? (
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-16 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-800/50 mb-6">
                      <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">No doubts found</h3>
                    <p className="text-base text-gray-500">
                      {filter === 'pending' 
                        ? 'All doubts have been answered!' 
                        : filter === 'answered'
                        ? 'No answered doubts yet.'
                        : 'No doubts have been asked yet.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {filteredDoubts.map((doubt) => (
                      <div key={doubt.id} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 hover:border-gray-700/50 transition-all group">
                        <div className="p-8">
                          {/* Header with better spacing */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center flex-wrap gap-3 mb-3">
                                {doubt.is_priority && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                    </svg>
                                    Priority
                                  </span>
                                )}
                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                                  doubt.status === 'answered' 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}>
                                  {doubt.status === 'answered' ? (
                                    <>
                                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      Answered
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      Pending
                                    </>
                                  )}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatTimeAgo(doubt.created_at)}
                                </span>
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                {doubt.title}
                              </h3>
                              <p className="text-sm text-gray-400">
                                Asked by <span className="text-gray-300 font-medium">{doubt.student_name || doubt.student_email}</span>
                              </p>
                            </div>
                          </div>

                          {/* Description with better typography */}
                          <div className="mb-6">
                            <p className="text-base text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {doubt.description}
                            </p>
                          </div>

                          {/* Answer Section with enhanced design */}
                          {doubt.status === 'answered' && doubt.answer && (
                            <div className="bg-gradient-to-r from-gray-800/40 to-gray-800/20 rounded-xl p-6 border border-gray-700/50">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <span className="text-base font-medium text-green-400">Answer</span>
                                </div>
                                {doubt.answered_at && (
                                  <span className="text-sm text-gray-500">
                                    Answered {formatTimeAgo(doubt.answered_at)}
                                  </span>
                                )}
                              </div>
                              <p className="text-base text-gray-200 leading-relaxed whitespace-pre-wrap">
                                {doubt.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;