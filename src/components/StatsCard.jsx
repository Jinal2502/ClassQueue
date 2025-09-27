// src/components/StatsCard.jsx

import React from 'react';

const StatsCard = ({ stats }) => {
  const getPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const resolutionRate = getPercentage(stats.answered, stats.total);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Total Doubts */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase">Total</span>
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        </div>
        <p className="text-2xl font-bold text-white">{stats.total || 0}</p>
        <p className="text-xs text-gray-600 mt-1">All doubts</p>
      </div>

      {/* Answered */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase">Resolved</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <p className="text-2xl font-bold text-green-400">{stats.answered || 0}</p>
        <p className="text-xs text-gray-600 mt-1">{resolutionRate}% rate</p>
      </div>

      {/* Pending */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase">Pending</span>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        </div>
        <p className="text-2xl font-bold text-yellow-400">{stats.pending || 0}</p>
        <p className="text-xs text-gray-600 mt-1">In queue</p>
      </div>

      {/* Priority Queue */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase">Priority</span>
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
        <p className="text-2xl font-bold text-orange-400">{stats.priorityPending || 0}</p>
        <p className="text-xs text-gray-600 mt-1">Urgent</p>
      </div>

      {/* General Queue */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase">General</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
        <p className="text-2xl font-bold text-blue-400">{stats.generalPending || 0}</p>
        <p className="text-xs text-gray-600 mt-1">Standard</p>
      </div>
    </div>
  );
};

export default StatsCard;