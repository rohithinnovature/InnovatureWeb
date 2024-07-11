// useInactivityTimer.js

import { useEffect, useRef } from 'react';

const useInactivityTimer = (timeout, onTimeout) => {
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onTimeout();
    }, timeout);
  };

  const handleActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    // Initial setup
    resetTimer();

    // Event listeners
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      clearTimeout(timerRef.current);
    };
  }, [timeout, onTimeout]);

  // Return any cleanup function if needed
  return () => {
    clearTimeout(timerRef.current);
  };
};

export default useInactivityTimer;
