// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";


import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn";
import CheckForecast from "./components/CheckForecast";
import Dashboard from "./components/Dashboard";

function App() {
  // Load user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Clear login
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId="831965582475-nc5vpc6cc65ibfe0iur3e7vfa3ufje7i.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Sign In Page */}
          <Route
            path="/signin"
            element={
              user ? <Navigate to="/checkforecast" /> : <SignIn onLogin={handleLogin} />
            }
          />

          {/* Check Forecast Page */}
          <Route
            path="/checkforecast"
            element={
              user ? (
                <CheckForecast onLogout={handleLogout} user={user} />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />

          {/* Dashboard Page */}
          <Route
            path="/home"
            element={
              user ? (
                <Dashboard onLogout={handleLogout} user={user} />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
