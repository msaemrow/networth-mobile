import type { Account, AccountBalance } from '@/src/types/api';

export interface LatestAccountBalance {
  id: number; account: string; previous: number | null; latest: number | null;
  change: number | null; changePercent: number | null;
}
export interface DashboardCalculations {
  currentNetWorth: number; totalAssets: number; totalLiabilities: number; latestMonth: string;
  latestAccountBalances: LatestAccountBalance[];
  groupedAccountBalances: { id: number | string; label: string; value: number }[];
  monthlyNetWorthBalances: { month: string; value: number }[];
  decemberBalances: { year: string; value: number }[];
}

export const calculateDashboard = (accounts: Account[], balances: AccountBalance[]): DashboardCalculations => {
  const activeAccounts = accounts.filter(({ status }) => status === 'active');
  const activeIds = new Set(activeAccounts.map(({ id }) => id));
  const latestByAccount = new Map<number, AccountBalance>();
  balances.filter(({ accountId }) => activeIds.has(accountId)).forEach((balance) => {
    const current = latestByAccount.get(balance.accountId);
    if (!current || balance.balanceDate > current.balanceDate) latestByAccount.set(balance.accountId, balance);
  });

  const currentNetWorth = [...latestByAccount.values()].reduce((sum, row) => sum + Number(row.amount), 0);
  const totalAssets = activeAccounts.filter((row) => row.balanceClass === 'asset')
    .reduce((sum, row) => sum + Number(latestByAccount.get(row.id)?.amount ?? 0), 0);
  const totalLiabilities = activeAccounts.filter((row) => row.balanceClass === 'liability')
    .reduce((sum, row) => sum + Math.abs(Number(latestByAccount.get(row.id)?.amount ?? 0)), 0);
  const latestMonth = balances.filter(({ accountId }) => activeIds.has(accountId))
    .map(({ balanceDate }) => balanceDate.slice(0, 7)).sort().at(-1) ?? '';

  const latestAccountBalances = activeAccounts.map((account) => {
    const history = balances.filter(({ accountId }) => accountId === account.id)
      .sort((a, b) => b.balanceDate.localeCompare(a.balanceDate));
    const latest = history[0] ? Number(history[0].amount) : null;
    const previous = history[1] ? Number(history[1].amount) : null;
    const change = previous === null || latest === null ? null : latest - previous;
    return {
      id: account.id, account: account.name, previous, latest, change,
      changePercent: previous === null || previous === 0 || latest === null ? null : ((latest - previous) / Math.abs(previous)) * 100,
    };
  }).sort((a, b) => a.account.localeCompare(b.account));

  const groups = new Map<number | string, { id: number | string; label: string; value: number }>();
  activeAccounts.forEach((account) => {
    const memberships = account.accountType?.accountGroups?.length
      ? account.accountType.accountGroups : [{ id: 'unassigned', name: 'Unassigned' }];
    memberships.forEach((group) => {
      const current = groups.get(group.id) ?? { id: group.id, label: group.name, value: 0 };
      current.value += Number(latestByAccount.get(account.id)?.amount ?? 0);
      groups.set(group.id, current);
    });
  });

  const months = new Map<string, number>();
  const decembers = new Map<string, number>();
  balances.forEach(({ balanceDate, amount }) => {
    const month = balanceDate.slice(0, 7);
    months.set(month, (months.get(month) ?? 0) + Number(amount));
    if (balanceDate.slice(5, 7) === '12') {
      const year = balanceDate.slice(0, 4);
      decembers.set(year, (decembers.get(year) ?? 0) + Number(amount));
    }
  });

  return {
    currentNetWorth, totalAssets, totalLiabilities, latestMonth, latestAccountBalances,
    groupedAccountBalances: [...groups.values()].sort((a, b) => a.label.localeCompare(b.label)),
    monthlyNetWorthBalances: [...months].sort(([a], [b]) => a.localeCompare(b)).map(([month, value]) => ({ month, value })),
    decemberBalances: [...decembers].sort(([a], [b]) => a.localeCompare(b)).map(([year, value]) => ({ year, value })),
  };
};
