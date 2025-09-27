// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DoubtProvider } from './context/DoubtContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Timeline from './pages/Timeline';
import AskDoubt from './pages/AskDoubt';
import TeacherDashboard from './pages/TeacherDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DoubtProvider>
          <div className="min-h-screen bg-gray-900">
            <Navbar />
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Timeline />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/ask-doubt"
                element={
                  <ProtectedRoute requireRole="student">
                    <AskDoubt />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireRole="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </DoubtProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;