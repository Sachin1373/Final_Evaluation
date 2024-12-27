import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Contexts/ThemeContext';
import { AuthProvider } from './Contexts/AuthContext';
import Landingpage from './Pages/Landingpage';
import Settings from './Pages/Settings';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Sign_in from './Pages/Sign_in';
import SharedDashboard from './Pages/SharedDashboard';
import FillFrom from './Pages/FillFrom';
import Forms from './Pages/Forms';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
      <AuthProvider>
      <div>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-in" element={<Sign_in />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/shared-dashboard/:dashboardId" element={<SharedDashboard />} />
          <Route path="/forms/:formId/:name" element={<Forms />} />
          <Route path="/fill-form/:formId" element={<FillFrom />} />
        </Routes>
      </div>
      </AuthProvider>
    </Router>
    </ThemeProvider>
  );
}
