// src/pages/AskDoubt.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoubts } from '../context/DoubtContext';

const AskDoubt = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createDoubt } = useDoubts();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPriority: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { success, error: submitError } = await createDoubt(
        formData.title,
        formData.description,
        formData.isPriority
      );

      if (success) {
        // Show success message and redirect
        navigate('/', { 
          state: { message: 'Your doubt has been submitted successfully!' } 
        });
      } else {
        setError(submitError?.message || 'Failed to submit doubt');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Ask a Doubt</h1>
          <p className="text-sm text-gray-500 mt-1">
            Have a question? Submit your doubt and a teacher will answer it soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50">
              {error && (
                <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Doubt Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    placeholder="e.g., How does binary search work?"
                  />
                  <p className="mt-2 text-xs text-gray-600">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={8}
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none"
                    placeholder="Explain your doubt in detail. Include any specific examples or context that might help the teacher understand your question better."
                  />
                  <p className="mt-2 text-xs text-gray-600">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                {/* Priority Selection */}
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="isPriority"
                      name="isPriority"
                      checked={formData.isPriority}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500/50 border-gray-600 rounded bg-gray-800"
                    />
                    <label htmlFor="isPriority" className="ml-3 cursor-pointer">
                      <span className="block text-sm font-medium text-white">
                        Mark as Priority Doubt
                      </span>
                      <span className="block text-xs text-gray-400 mt-1">
                        Check this if your doubt is related to upcoming exams, placements, or urgent academic matters. 
                        Priority doubts are resolved first.
                      </span>
                    </label>
                  </div>

                  {formData.isPriority && (
                    <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-orange-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-orange-400">
                          This doubt will be added to the priority queue
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Doubt'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar - Info Sections */}
          <div className="space-y-6">
            {/* Queue System Info */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-5">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How Queue System Works:
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="mt-1 mr-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-300">General Queue:</p>
                    <p className="text-xs text-gray-500">
                      Doubts are answered in First-Come-First-Serve order
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 mr-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-300">Priority Queue:</p>
                    <p className="text-xs text-gray-500">
                      Urgent doubts are resolved before general doubts
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-5">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tips for Getting Better Answers
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-gray-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-xs font-medium text-gray-300">Be Specific</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Include details about what you've already tried</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-gray-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-xs font-medium text-gray-300">Provide Context</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Mention the topic or chapter you're studying</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-gray-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-xs font-medium text-gray-300">Use Examples</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Share specific examples or scenarios</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-gray-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-xs font-medium text-gray-300">Check Timeline</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Your doubt might already be answered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Queue Status */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-5">
              <h3 className="text-sm font-medium text-white mb-3">Current Queue Status</h3>
              <div className="space-y-2">
                
                <div className="flex items-center justify-between py-2 px-3 bg-gray-800/30 rounded-lg">
                  <span className="text-xs text-gray-400">Teachers Active</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs font-medium text-gray-300">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskDoubt;