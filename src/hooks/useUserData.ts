'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { getAuthToken } from '@/lib/api/request';
import { getUserInitials, formatJlptLevel } from '@/lib/api/dashboard';

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

export function useUserData() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER);

  useEffect(() => {
    let active = true;

    const fetchUserData = async () => {
      const token = getAuthToken();

      if (!token) {
        if (!active) return;
        setUserData({
          ...DEFAULT_USER,
          loading: false,
          isAuthenticated: false,
        });
        router.push('/auth/login');
        return;
      }

      try {
        const response = await authApi.me(token);

        if (!active) return;

        if (response.error || !response.data?.user) {
          setUserData({
            ...DEFAULT_USER,
            loading: false,
            isAuthenticated: false,
          });
          router.push('/auth/login');
          return;
        }

        const user = response.data.user;

        const fullName = user.full_name || 'Student';
        const jlptLevel = formatJlptLevel(user.jlpt_target_level || 'N5');

        setUserData({
          fullName,
          jlptLevel,
          userInitial: getUserInitials(fullName),
          loading: false,
          isAuthenticated: true,
        });
      } catch (err) {
        console.error('Failed to fetch user data:', err);

        if (!active) return;

        setUserData({
          ...DEFAULT_USER,
          loading: false,
          isAuthenticated: false,
        });

        router.push('/auth/login');
      }
    };

    fetchUserData();

    return () => {
      active = false;
    };
  }, [router]);

  return userData;
}

export default useUserData;