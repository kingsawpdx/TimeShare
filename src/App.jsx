//import React, { useEffect, useState } from "react";
import React from "react";
import { useState, useEffect } from "react";
import NavMenu from "./components/NavMenu";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import EventsPage from "./pages/EventsPage";
import "./styles.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("logged_in");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []); // Only check on initial mount

  const handleLogin = () => {
    localStorage.setItem("logged_in", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "GET",
        credentials: "include", // Ensures cookies/session data is sent
      });

      if (response.redirected) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }

    localStorage.setItem("logged_in", "false");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <NavMenu isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/calendar"
          element={
            <CalendarPage onLogin={handleLogin} isLoggedIn={isLoggedIn} />
          }
        />
        <Route path="/search" element={<EventsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
