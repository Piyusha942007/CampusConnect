import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CompleteProfile from './pages/auth/CompleteProfile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLayout from './components/AdminLayout';
import AmbassadorDashboard from './pages/ambassador/Dashboard';
import AmbassadorLayout from './components/AmbassadorLayout';
import Navbar from './components/Navbar';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const ConditionalNavbar = () => {
  const location = useLocation();
  // Hide global navbar on landing, login, and register pages as they have their own or need full screen
  const hidePaths = ['/', '/login', '/register', '/complete-profile'];
  if (hidePaths.includes(location.pathname)) return null;
  return <Navbar />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <ConditionalNavbar />
        <main className="pt-32">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ambassador/*" 
              element={
                <ProtectedRoute role="ambassador">
                  <AmbassadorLayout />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
