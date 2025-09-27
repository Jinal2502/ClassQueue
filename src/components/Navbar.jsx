// src/components/Navbar.jsx

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, LogOut, User, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, userRole, signOut, isTeacher, isStudent } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
                  <Users className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Activity className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-tight group-hover:text-purple-200 transition-colors">
                  ClassQueue
                </span>
                <span className="text-xs text-gray-500 -mt-1">
                  Smart Queue System
                </span>
              </div>
            </Link>

            {/* Main Navigation */}
            {user && (
              <div className="ml-12 flex items-center space-x-2">
                <Link
                  to="/"
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive('/') 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent hover:border-gray-700/50'
                  }`}
                >
                  <span className="relative z-10">Timeline</span>
                  {isActive('/') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm"></div>
                  )}
                </Link>

                {isStudent() && (
                  <Link
                    to="/ask-doubt"
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive('/ask-doubt')
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent hover:border-gray-700/50'
                    }`}
                  >
                    <span className="relative z-10">Ask Doubt</span>
                    {isActive('/ask-doubt') && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm"></div>
                    )}
                  </Link>
                )}

                {isTeacher() && (
                  <Link
                    to="/dashboard"
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive('/dashboard')
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent hover:border-gray-700/50'
                    }`}
                  >
                    <span className="relative z-10">Dashboard</span>
                    {isActive('/dashboard') && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm"></div>
                    )}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        userRole === 'teacher' ? 'bg-purple-400' : 'bg-blue-400'
                      } animate-pulse`}></div>
                      <p className="text-xs text-gray-400 capitalize font-medium">
                        {userRole}
                      </p>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
                      <User className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-gray-950"></div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="group flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:bg-gray-700/60 hover:text-white hover:border-gray-600/60 transition-all duration-300 backdrop-blur-sm"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="group relative overflow-hidden px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 group-hover:translate-x-12 transition-transform duration-1000"></div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;