import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthProvider, useAuth } from '@/src/auth/AuthContext';

export default function RootLayout() {
  return <AuthProvider><AuthenticatedStack /></AuthProvider>;
}

function AuthenticatedStack() {
  const { account, isLoading, registrationEnabled } = useAuth();
  if (isLoading) return <View style={styles.loading}><ActivityIndicator size="large" color="#28735b" /><StatusBar style="dark" /></View>;

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f7f8f4' },
          headerShadowVisible: false,
          headerTintColor: '#17352d',
          contentStyle: { backgroundColor: '#f7f8f4' },
        }}>
        <Stack.Protected guard={Boolean(account)}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="monthly-balances" options={{ title: 'Monthly balances' }} />
        </Stack.Protected>
        <Stack.Protected guard={!account}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Protected guard={registrationEnabled}>
            <Stack.Screen name="register" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack.Protected>
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', backgroundColor: '#f7f8f4', flex: 1, justifyContent: 'center' },
});
