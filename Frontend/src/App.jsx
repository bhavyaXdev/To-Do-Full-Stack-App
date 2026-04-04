import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppContainer from "./To-Do-App-Container/AppContainer";
import Auth from "./To-Do-App-Container/Auth";

import { useSelector } from "react-redux";

// Simple Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/auth" />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route (Login / Signup) */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Home Route */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppContainer />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
