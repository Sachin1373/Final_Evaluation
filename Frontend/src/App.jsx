import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Contexts/ThemeContext';
import Landingpage from './Pages/Landingpage';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Sign_in from './Pages/Sign_in';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-in" element={<Sign_in />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
}
