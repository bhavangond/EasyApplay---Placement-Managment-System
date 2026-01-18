import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';

import AdminLogin from './pages/admin/AdminLogin';
import AdminJobs from './pages/admin/AdminJobs';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateJob from './pages/admin/CreateJob';

import StudentLogin from './pages/student/StudentLogin';
import StudentSignup from './pages/student/StudentSignup';
import StudentJobs from './pages/student/StudentJobs';
import MyApplications from './pages/student/MyApplications';
import StudentProfile from './pages/student/StudentProfile';
import StudentDashboard from './pages/student/StudentDashboard';

import LoginSelect from './pages/LoginSelect';
import Statistics from './pages/Statistics';

import './App.css';

function App() {
  return (
    <div className="app-root">
      <main className="page-container" style={{ padding: 0, maxWidth: '100%' }}>
        <Routes>
          <Route path="/" element={<LoginSelect />} />
          <Route path="/statistics" element={<Statistics />} />

          {/* AUTH */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/signup" element={<StudentSignup />} />

          {/* ADMIN */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="ROLE_ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute role="ROLE_ADMIN"><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/create-job" element={<ProtectedRoute role="ROLE_ADMIN"><CreateJob /></ProtectedRoute>} />

          {/* STUDENT */}
          <Route path="/student/dashboard" element={<ProtectedRoute role="ROLE_STUDENT"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/jobs" element={<ProtectedRoute role="ROLE_STUDENT"><StudentJobs /></ProtectedRoute>} />
          <Route path="/student/my-applications" element={<ProtectedRoute role="ROLE_STUDENT"><MyApplications /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="ROLE_STUDENT"><StudentProfile /></ProtectedRoute>} />

        </Routes>
      </main>
    </div>
  );
}

export default App;
