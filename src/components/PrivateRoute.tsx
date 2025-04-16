import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Replace this with your actual authentication check
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    // Redirect to login page, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If there are children, render them, otherwise render the outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute; 