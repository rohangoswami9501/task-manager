import { useMemo } from 'react';

export const useAuth = () => {
  return useMemo(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { 
        user: null, 
        isAdmin: false, 
        isAuthenticated: false 
      };
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        user: payload,
        isAdmin: payload.role === 'ADMIN',
        isAuthenticated: true
      };
    } catch (error) {
      return { 
        user: null, 
        isAdmin: false, 
        isAuthenticated: false 
      };
    }
  }, []);
};
