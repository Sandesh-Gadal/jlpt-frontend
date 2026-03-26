'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

interface UserData {
  fullName: string;
  jlptLevel: string;
  userInitial: string;
  email: string;
  avatar?: string;
}

interface UserDataContextValue {
  user: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

type RawUser = {
  full_name?: string;
  name?: string;
  jlpt_target_level?: string | null;
  level?: string | null;
  email?: string;
  avatar_url?: string | null;
};

const UserDataContext = createContext<UserDataContextValue>({
  user: null,
  loading: true,
  isAuthenticated: false,
  refetch: async () => {},
});

const STORAGE_KEY = 'jlpt_user_cache';

function getUserFromStorage(): UserData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUserToStorage(user: UserData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

function clearUserFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('jlpt_token'); // optional legacy cleanup
    localStorage.removeItem('jlpt_user');  // optional legacy cleanup
  } catch {}
}

function parseUser(raw: RawUser): UserData {
  const name = raw.full_name || raw.name || 'User';
  const initial = name.charAt(0).toUpperCase();
  const level = raw.jlpt_target_level || raw.level || 'N3';

  return {
    fullName: name,
    jlptLevel: level,
    userInitial: initial,
    email: raw.email || '',
    avatar: raw.avatar_url || undefined,
  };
}

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const initialUser = typeof window !== 'undefined' ? getUserFromStorage() : null;

  const [user, setUser] = useState<UserData | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(!initialUser);

  const hasFetchedRef = useRef(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        clearUserFromStorage();
        setUser(null);
        return;
      }

      const data = await res.json();
      const parsed = parseUser(data.user ?? data);

      saveUserToStorage(parsed);
      setUser(parsed);
    } catch {
      const cached = getUserFromStorage();
      setUser(cached);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchUser();
  }, [fetchUser]);

  const isAuthenticated = !!user;

  return (
    <UserDataContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        refetch: fetchUser,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserDataContext);
}