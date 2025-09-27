// src/components/QueueVisualizer.jsx

import React, { useState, useEffect } from 'react';

const QueueVisualizer = ({ queue = [], type = 'general', lastAction = null }) => {
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const [animationType, setAnimationType] = useState(null);

  useEffect(() => {
    if (lastAction) {
      if (lastAction.type === 'enqueue') {
        setAnimationType('enqueue');
        setAnimatingIndex(queue.length - 1);
      } else if (lastAction.type === 'dequeue') {
        setAnimationType('dequeue');
        setAnimatingIndex(0);
      }
      
      const timer = setTimeout(() => {
        setAnimatingIndex(null);
        setAnimationType(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [lastAction, queue.length]);

  const getAccentColor = () => {
    return type === 'priority' ? 'orange' : 'blue';
  };

  // Calculate queue metrics
  const queueUtilization = Math.min((queue.length / 10) * 100, 100);
  const avgProcessingTime = queue.length * 3; // Mock calculation

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
      {/* Header with Metrics */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-100 mb-1">
            {type === 'priority' ? 'Priority Queue' : 'General Queue'}
          </h3>
          <p className="text-xs text-gray-500">Real-time visualization</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-white">{queue.length}</p>
          <p className="text-xs text-gray-500">in queue</p>
        </div>
      </div>

      {/* Visual Queue Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Queue Status</span>
          <span>{queueUtilization.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              type === 'priority' ? 'bg-orange-500' : 'bg-blue-500'
            }`}
            style={{ width: `${queueUtilization}%` }}
          />
        </div>
      </div>

      {/* Queue Flow Visualization */}
      <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {queue.length === 0 ? (
            <div className="flex-1 text-center py-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 mb-2">
                <div className={`w-2 h-2 rounded-full bg-gray-600`}></div>
              </div>
              <p className="text-xs text-gray-600">Queue empty</p>
            </div>
          ) : (
            <>
              {/* Dequeue Arrow */}
              <div className="flex-shrink-0">
                <svg className={`w-4 h-4 ${queue.length > 0 ? 'text-red-500' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Queue Items */}
              {queue.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex-shrink-0 transition-all duration-300 ${
                    animatingIndex === index 
                      ? animationType === 'enqueue' ? 'scale-110' : 'scale-90 opacity-50'
                      : ''
                  }`}
                >
                  <div className={`w-16 h-10 rounded-lg border flex items-center justify-center ${
                    index === 0 
                      ? type === 'priority'
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      : 'bg-gray-800/50 border-gray-700/50 text-gray-500'
                  }`}>
                    <span className="text-xs font-medium">#{index + 1}</span>
                  </div>
                </div>
              ))}

              {/* Enqueue Arrow */}
              <div className="flex-shrink-0">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Processing</p>
          <p className="text-sm font-medium text-gray-200">
            {queue.length > 0 ? 'Active' : 'Idle'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Avg Time</p>
          <p className="text-sm font-medium text-gray-200">
            {avgProcessingTime} min
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Type</p>
          <p className="text-sm font-medium text-gray-200">
            {type === 'priority' ? 'Priority' : 'FIFO'}
          </p>
        </div>
      </div>

      {/* Activity Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              queue.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
            }`}></div>
            <span className="text-xs text-gray-500">
              {queue.length > 0 ? 'Processing queue' : 'Waiting for items'}
            </span>
          </div>
          {queue.length > 0 && (
            <span className={`text-xs font-medium ${
              type === 'priority' ? 'text-orange-400' : 'text-blue-400'
            }`}>
              Next: {queue[0]?.title?.substring(0, 15)}...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueVisualizer;