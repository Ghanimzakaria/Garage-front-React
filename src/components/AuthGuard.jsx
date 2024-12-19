import React from 'react';
import { Navigate } from 'react-router-dom';

export const AuthGuard = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('access_token'); // Example auth check

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
