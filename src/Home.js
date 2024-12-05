import CarManagementComponent from "./components/CarManagementComponent";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import { AuthGuard } from './components/AuthGuard';
function Home() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/car-management"
          element={
            <AuthGuard>
              <CarManagementComponent />
            </AuthGuard>
          }
        />
        <Route path="/" element={<Login />} /> {/* Redirect to login by default */}
      </Routes>
    </Router>
  );
}

export default Home;
