// Layout.js

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useInactivityTimer from './useInactivityTimer'; // Replace with the correct path to your useInactivityTimer hook
import LoginForm from './LoginForm'; // Replace with your actual LoginForm component

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Replace with your actual authentication logic

  // Call useInactivityTimer directly inside the functional component body
  useInactivityTimer(1000000, () => {
    if (isAuthenticated) {
      console.log('User inactive, logging out...');
      // Perform logout or any action on timeout
      // Clear user session (e.g., cookies, localStorage)
      // Redirect to login page
      setIsAuthenticated(false)
      navigate('/login');
    }
  });

  // Redirect to login page if not authenticated and not on the login page
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      setIsAuthenticated(true);  
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <div>
      {/* Your layout content */}
      {children}
    </div>
  );
};

export default Layout;
