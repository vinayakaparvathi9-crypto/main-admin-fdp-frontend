import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FacultyManagement from './pages/FacultyManagement';
import Departments from './pages/Departments';
import Workload from './pages/Workload';
import PerformanceAppraisal from './pages/PerformanceAppraisal';
import Attendance from './pages/Attendance';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/faculty" element={<FacultyManagement />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/workload" element={<Workload />} />
          <Route path="/appraisal" element={<PerformanceAppraisal />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<div className="card"><h3>Reports Page</h3><p>Placeholder for PDF/CSV reports.</p></div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
