export interface AccountGroup { id: number; name: string; showInChart?: boolean }
export interface AccountType { id: number; name: string; showInChart?: boolean; accountGroups?: AccountGroup[] }
export interface Account { id: number; name: string; status: string; balanceClass: 'asset' | 'liability'; accountType?: AccountType }
export interface AccountBalance { id: number; accountId: number; balanceDate: string; amount: number | string }
export interface SavingsSummary {
  annualIncome: number; totalContribution: number; totalSavingsRate: number;
  retirementContribution: number; retirementSavingsRate: number; contributionBreakdown: unknown[];
}
interface HouseFundBalance { amount: number; balanceDate: string }
interface HouseFundComponent { accountId: number; accountName: string; balance: HouseFundBalance | null }
export type HouseFundSummary = { configured: false } | {
  configured: true; homeEquity: number; availableCash: number; total: number;
  targetAmount: number | null; remaining: number | null; progressPercent: number | null;
  missingBalanceAccountIds: number[];
  components: { homeValue: HouseFundComponent; primaryMortgage: HouseFundComponent; secondaryLoan: HouseFundComponent | null; savings: HouseFundComponent; emergencyReserve: number };
};
export interface RetirementSummary { currentBalance: number; annualContribution: number; monthlyContribution: number }
export interface AuthAccount { id: number; email: string }
export interface AuthHousehold { id: number; name: string; showHouseFund: boolean }
export interface AuthSession { token?: string; account: AuthAccount; household: AuthHousehold }
export interface AuthConfig { registrationEnabled: boolean }
