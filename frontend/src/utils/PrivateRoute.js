import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectAuthLoading } from '../features/auth/authSlice';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);

  // Set initial load to false after first render
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking authentication
  if (loading || initialLoad) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }


  // If not authenticated, redirect to login page with the return url
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child components
  return children;
};

export default PrivateRoute;
