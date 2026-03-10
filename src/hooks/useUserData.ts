'use client';

import { useState, useEffect } from 'react';
import { authApi, getAuthToken, getUserInitials, formatJlptLevel } from '@/lib/api';

interface UserData {
  fullName: string;
  jlptLevel: string;
  userInitial: string;
  loading: boolean;
  isAuthenticated: boolean;
}

const DEFAULT_USER: UserData = {
  fullName: 'Student',
  jlptLevel: 'N5',
  userInitial: 'S',
  loading: true,
  isAuthenticated: false,
};

/**
 * Custom hook to fetch and manage user data for AppShell
 * Returns dynamic user data (name, initials, JLPT level) from auth API
 */
export function useUserData() {
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getAuthToken();
      
      if (!token) {
        setUserData({
          ...DEFAULT_USER,
          loading: false,
          isAuthenticated: false,
        });
        return;
      }

      try {
        const response = await authApi.me(token);
        
        if (response.data) {
          const fullName = response.data.full_name || 'Student';
          // Note: jlpt_target_level may not be available in /auth/me response
          // It will default to N5, but could be enhanced to fetch from dashboard API
          const jlptLevel = 'N5'; // Default - can be enhanced later
          
          setUserData({
            fullName,
            jlptLevel: formatJlptLevel(jlptLevel),
            userInitial: getUserInitials(fullName),
            loading: false,
            isAuthenticated: true,
          });
        } else {
          // Auth error - use defaults
          setUserData({
            ...DEFAULT_USER,
            loading: false,
            isAuthenticated: false,
          });
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setUserData({
          ...DEFAULT_USER,
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    fetchUserData();
  }, []);

  return userData;
}

export default useUserData;

