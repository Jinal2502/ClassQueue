// src/components/QueueDisplay.jsx

import React from 'react';

const QueueDisplay = ({ 
  title, 
  queue = [], 
  type = 'general', 
  onResolve = null,
  emptyMessage = 'No doubts in queue' 
}) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${
              type === 'priority' ? 'bg-orange-500' : 'bg-blue-500'
            }`}></div>
            <h2 className="text-sm font-medium text-gray-100">{title}</h2>
          </div>
          <span className="text-2xl font-semibold text-white">
            {queue.length}
          </span>
        </div>
      </div>

      {/* Queue Items */}
      <div className="p-4">
        {queue.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-800/50 mb-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map((doubt, index) => (
              <div 
                key={doubt.id} 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  index === 0 
                    ? 'bg-gray-800/70 border border-gray-700/50' 
                    : 'bg-gray-800/30 hover:bg-gray-800/50'
                }`}
              >
                {/* Position */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                  index === 0 
                    ? type === 'priority' 
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {doubt.is_priority && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
                        <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        Priority
                      </span>
                    )}
                    <h3 className="text-sm font-medium text-gray-200 truncate">
                      {doubt.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {doubt.student_name || doubt.student_email}
                  </p>
                </div>

                {/* Action */}
                {onResolve && index === 0 && (
                  <button
                    onClick={() => onResolve(doubt)}
                    className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      type === 'priority'
                        ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30'
                        : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                    }`}
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {queue.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-800/50 bg-gray-900/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              {type === 'priority' ? 'Priority queue' : 'FIFO processing'}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">AVG WAIT</span>
              <span className="text-xs font-medium text-gray-400">~5 min</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueDisplay;