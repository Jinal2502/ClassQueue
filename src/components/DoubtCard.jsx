// src/components/DoubtCard.jsx

import React from 'react';

const DoubtCard = ({ doubt, onResolve = null, showActions = false }) => {
  const formatDate = (dateString) => {
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

  const getPriorityBadge = () => {
    if (!doubt.is_priority) return null;
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-200">
        <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
        Priority
      </span>
    );
  };

  const getStatusBadge = () => {
    if (doubt.status === 'answered') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
          <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Answered
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
        <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Pending
      </span>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {getPriorityBadge()}
            {getStatusBadge()}
            <span className="text-xs text-gray-400">
              {formatDate(doubt.created_at)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {doubt.title}
          </h3>
          <p className="text-sm text-gray-400">
            Asked by {doubt.student_name || doubt.student_email}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-gray-300 whitespace-pre-wrap">
          {doubt.description}
        </p>
      </div>

      {/* Answer Section */}
      {doubt.status === 'answered' && doubt.answer && (
        <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-400">Answer</span>
            {doubt.answered_at && (
              <span className="ml-auto text-xs text-gray-500">
                Answered {formatDate(doubt.answered_at)}
              </span>
            )}
          </div>
          <p className="text-gray-300 whitespace-pre-wrap">
            {doubt.answer}
          </p>
        </div>
      )}

      {/* Action Button for Teachers */}
      {showActions && doubt.status === 'pending' && onResolve && (
        <div className="mt-4">
          <button
            onClick={() => onResolve(doubt)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            Resolve This Doubt
          </button>
        </div>
      )}
    </div>
  );
};

export default DoubtCard;