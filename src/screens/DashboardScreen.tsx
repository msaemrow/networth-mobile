import { useState } from "react";
import { router, type Href } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/src/components/ui/Card";
import { Metric } from "@/src/components/ui/Metric";
import { LineChart } from "@/src/components/charts/LineChart";
import { useDashboard } from "@/src/hooks/useDashboard";
import { useAuth } from "@/src/auth/AuthContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});
const formatMonth = (month: string) =>
  monthFormatter.format(new Date(`${month}-01T12:00:00`));

export function DashboardScreen() {
  const { household, logout } = useAuth();
  const { data, error, isLoading, isRefreshing, load } = useDashboard();
  const [hidden, setHidden] = useState(false);
  const money = (value: number | null) =>
    value === null
      ? "No balance recorded"
      : hidden
        ? "••••••"
        : currency.format(value);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void load(true)}
            tintColor="#17352d"
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>NET WORTH</Text>
            <Text style={styles.heading}>{household?.name || "Dashboard"}</Text>
          </View>
          <View style={styles.privacy}>
            <Text style={styles.privacyLabel}>Hide amounts</Text>
            <Switch
              value={hidden}
              onValueChange={setHidden}
              trackColor={{ true: "#74a892" }}
            />
          </View>
        </View>
        <Pressable accessibilityRole="button" style={styles.logoutButton} onPress={() => void logout()}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </Pressable>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/monthly-balances" as Href)}
        >
          <Text style={styles.primaryButtonText}>Add monthly balances</Text>
        </Pressable>

        {isLoading ? (
          <View style={styles.status}>
            <ActivityIndicator size="large" color="#28735b" />
            <Text style={styles.muted}>Loading your financial picture…</Text>
          </View>
        ) : error ? (
          <Card title="Dashboard unavailable">
            <Text style={styles.error}>{error}</Text>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => void load()}
            >
              <Text style={styles.secondaryButtonText}>Try again</Text>
            </Pressable>
          </Card>
        ) : data ? (
          <>
            <Metric
              label="Total net worth"
              value={money(data.currentNetWorth)}
              description="Latest balance recorded for each active account."
              highlight
            />
            <View style={styles.columns}>
              <View style={styles.column}>
                <Metric label="Total assets" value={money(data.totalAssets)} />
              </View>
              <View style={styles.column}>
                <Metric
                  label="Total liabilities"
                  value={money(data.totalLiabilities)}
                />
              </View>
            </View>

            <Metric
              label="Annual income"
              value={money(Number(data.savings.annualIncome || 0))}
            />
            <Text style={styles.section}>Savings</Text>
            <View style={styles.columns}>
              <View style={styles.column}>
                <Metric
                  label="Retirement savings rate"
                  value={`${Number(data.savings.retirementSavingsRate || 0).toFixed(1)}%`}
                  description={money(
                    Number(data.savings.retirementContribution || 0),
                  )}
                />
              </View>
              <View style={styles.column}>
                <Metric
                  label="Total savings rate"
                  value={`${Number(data.savings.totalSavingsRate || 0).toFixed(1)}%`}
                  description={money(
                    Number(data.savings.totalContribution || 0),
                  )}
                />
              </View>
            </View>

            <Text style={styles.section}>Retirement</Text>
            <View style={styles.columns}>
              <View style={styles.column}>
                <Metric
                  label="Currently saved"
                  value={money(Number(data.retirement.currentBalance || 0))}
                />
              </View>
              <View style={styles.column}>
                <Metric
                  label="Annual contributions"
                  value={money(Number(data.retirement.annualContribution || 0))}
                />
              </View>
            </View>
            <Metric
              label="Monthly contributions"
              value={money(Number(data.retirement.monthlyContribution || 0))}
            />

            {data.houseFund.configured ? (
              <Card
                title="House fund"
                subtitle="Home equity plus available savings after the emergency reserve."
              >
                {data.houseFund.missingBalanceAccountIds.length ? (
                  <Text style={styles.warning}>
                    One or more configured accounts have no balance and are
                    treated as zero.
                  </Text>
                ) : null}
                <Row
                  label="Home equity"
                  value={money(Number(data.houseFund.homeEquity))}
                />
                <Row
                  label="Available cash"
                  value={money(Number(data.houseFund.availableCash))}
                />
                <Row
                  label="Total house fund"
                  value={money(Number(data.houseFund.total))}
                  strong
                />
                {data.houseFund.targetAmount !== null ? (
                  <Text style={styles.muted}>
                    {Math.max(
                      0,
                      Number(data.houseFund.progressPercent),
                    ).toFixed(1)}
                    % of target · {money(Number(data.houseFund.remaining))}{" "}
                    remaining
                  </Text>
                ) : null}
              </Card>
            ) : (
              <Card
                title="House fund"
                subtitle="Configure your down-payment tracker in the web app."
              />
            )}

            <Card
              title="Net worth by month"
              subtitle="Monthly totals across all recorded accounts."
            >
              {data.monthlyNetWorthBalances.length ? (
                <LineChart
                  data={data.monthlyNetWorthBalances.slice(-12).map((row) => ({
                    label: formatMonth(row.month).replace(" ", " ’"),
                    value: row.value,
                  }))}
                  hideValues={hidden}
                  accessibilityLabel="Line chart showing net worth by month"
                />
              ) : (
                <Text style={styles.muted}>No balance history recorded.</Text>
              )}
            </Card>
            <Card
              title="Year-end net worth"
              subtitle="December balance totals across all recorded accounts."
            >
              {data.decemberBalances.length ? (
                <LineChart
                  data={data.decemberBalances.map((row) => ({
                    label: row.year,
                    value: row.value,
                  }))}
                  hideValues={hidden}
                  accessibilityLabel="Line chart showing year-end net worth"
                />
              ) : (
                <Text style={styles.muted}>No December balances recorded.</Text>
              )}
            </Card>
            <Card
              title="Latest account balances"
              subtitle={
                data.latestMonth
                  ? formatMonth(data.latestMonth)
                  : "No reporting month"
              }
            >
              {data.latestAccountBalances.length ? (
                data.latestAccountBalances.map((row) => (
                  <View key={row.id} style={styles.accountRow}>
                    <View style={styles.accountText}>
                      <Text style={styles.rowLabel}>{row.account}</Text>
                      <Text style={styles.muted}>
                        {row.changePercent === null
                          ? "No prior balance"
                          : `${row.change && row.change > 0 ? "▲" : row.change && row.change < 0 ? "▼" : "—"} ${Math.abs(row.changePercent).toFixed(1)}%`}
                      </Text>
                    </View>
                    <Text style={styles.rowValue}>{money(row.latest)}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.muted}>No active accounts.</Text>
              )}
            </Card>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.rowValue, strong && styles.strong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#f7f8f4", flex: 1 },
  content: { gap: 14, padding: 18, paddingBottom: 44 },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "#28735b",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  heading: { color: "#17352d", fontSize: 30, fontWeight: "800" },
  privacy: { alignItems: "center" },
  privacyLabel: { color: "#69756f", fontSize: 11 },
  logoutButton: { alignSelf: "flex-end", paddingHorizontal: 4, paddingVertical: 2 },
  logoutButtonText: { color: "#28735b", fontSize: 13, fontWeight: "700" },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#28735b",
    borderRadius: 12,
    padding: 15,
  },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  secondaryButton: {
    alignSelf: "flex-start",
    borderColor: "#28735b",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: { color: "#28735b", fontWeight: "700" },
  status: { alignItems: "center", gap: 14, paddingVertical: 60 },
  error: { color: "#9b2f2f", fontSize: 14, lineHeight: 21 },
  warning: {
    backgroundColor: "#fff5dd",
    borderRadius: 10,
    color: "#76530b",
    fontSize: 13,
    lineHeight: 19,
    padding: 12,
  },
  section: { color: "#17352d", fontSize: 20, fontWeight: "800", marginTop: 8 },
  columns: { flexDirection: "row", gap: 12 },
  column: { flex: 1 },
  row: {
    alignItems: "center",
    borderTopColor: "#edf0ee",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 11,
  },
  accountRow: {
    alignItems: "center",
    borderTopColor: "#edf0ee",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingTop: 12,
  },
  accountText: { flex: 1, gap: 3 },
  rowLabel: { color: "#34443e", flex: 1, fontSize: 14 },
  rowValue: {
    color: "#17352d",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },
  strong: { fontWeight: "800" },
  muted: { color: "#74817b", fontSize: 12, lineHeight: 17 },
});
