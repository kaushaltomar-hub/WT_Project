import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrakritiTest from './pages/PrakritiTest';
import DietPlan from './pages/DietPlan';
import FoodLibrary from './pages/FoodLibrary';
import HealthLog from './pages/HealthLog';
import Profile from './pages/Profile';
import SeasonalGuide from './pages/SeasonalGuide';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/prakriti" element={<PrivateRoute><PrakritiTest /></PrivateRoute>} />
        <Route path="/diet-plan" element={<PrivateRoute><DietPlan /></PrivateRoute>} />
        <Route path="/foods" element={<PrivateRoute><FoodLibrary /></PrivateRoute>} />
        <Route path="/health-log" element={<PrivateRoute><HealthLog /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/seasonal" element={<PrivateRoute><SeasonalGuide /></PrivateRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
