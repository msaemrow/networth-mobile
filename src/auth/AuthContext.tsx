import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/src/services/api';
import { tokenStorage } from '@/src/services/tokenStorage';
import type { AuthAccount, AuthHousehold, AuthSession } from '@/src/types/api';

type LoginDetails = { email: string; password: string };
type RegisterDetails = LoginDetails & { householdName: string; passwordConfirmation: string };
type AuthValue = {
  account: AuthAccount | null;
  household: AuthHousehold | null;
  isLoading: boolean;
  login: (details: LoginDetails) => Promise<void>;
  register: (details: RegisterDetails) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [account, setAccount] = useState<AuthAccount | null>(null);
  const [household, setHousehold] = useState<AuthHousehold | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clear = useCallback(async () => {
    api.setAuthToken(null);
    setAccount(null);
    setHousehold(null);
    await tokenStorage.remove();
  }, []);

  const apply = useCallback(async (session: AuthSession) => {
    if (session.token) {
      api.setAuthToken(session.token);
      await tokenStorage.set(session.token);
    }
    setAccount(session.account);
    setHousehold(session.household);
  }, []);

  useEffect(() => {
    api.onUnauthorized(() => { void clear(); });
    const restore = async () => {
      try {
        const token = await tokenStorage.get();
        if (!token) return;
        api.setAuthToken(token);
        await apply(await api.get<AuthSession>('/auth/me'));
      } catch {
        await clear();
      } finally {
        setIsLoading(false);
      }
    };
    void restore();
    return () => api.onUnauthorized(null);
  }, [apply, clear]);

  const value = useMemo<AuthValue>(() => ({
    account,
    household,
    isLoading,
    login: async (details) => apply(await api.post<AuthSession>('/auth/login', details)),
    register: async (details) => apply(await api.post<AuthSession>('/auth/register', details)),
    logout: clear,
  }), [account, household, isLoading, apply, clear]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
};
