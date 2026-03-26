'use client';

import { useUserContext } from '@/app/[locale]/context/UserDataContext';

export function useUserData() {
  const { user, loading, isAuthenticated, refetch } = useUserContext();

  return {
    fullName: user?.fullName ?? 'Student',
    jlptLevel: user?.jlptLevel ?? 'N5',
    userInitial: user?.userInitial ?? 'S',
    email: user?.email ?? '',
    avatar: user?.avatar,
    loading,
    isAuthenticated,
    refetch,
  };
}

export default useUserData;