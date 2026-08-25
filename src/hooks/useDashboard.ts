import { useCallback, useEffect, useState } from 'react';
import { api } from '@/src/services/api';
import type { Account, AccountBalance, HouseFundSummary, RetirementSummary, SavingsSummary } from '@/src/types/api';
import { calculateDashboard, type DashboardCalculations } from '@/src/utils/dashboard';

interface DashboardData extends DashboardCalculations {
  savings: SavingsSummary; houseFund: HouseFundSummary; retirement: RetirementSummary;
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const [accounts, balances, savings, houseFund, retirement] = await Promise.all([
        api.get<Account[]>('/accounts'), api.get<AccountBalance[]>('/account-balances'),
        api.get<SavingsSummary>('/contributions/savings-summary'), api.get<HouseFundSummary>('/house-fund'),
        api.get<RetirementSummary>('/retirement/plan'),
      ]);
      setData({ ...calculateDashboard(accounts, balances), savings, houseFund, retirement });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load the dashboard.');
    } finally {
      setIsLoading(false); setIsRefreshing(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);
  return { data, error, isLoading, isRefreshing, load };
};
