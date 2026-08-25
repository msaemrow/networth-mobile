import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MonthlyBalancesScreen() {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Monthly balances</Text>
        <Text style={styles.body}>Balance entry will be added in Phase 4. The dashboard is ready to test now.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f8f4' },
  container: { padding: 24, gap: 10 },
  title: { color: '#17352d', fontSize: 28, fontWeight: '800' },
  body: { color: '#52605b', fontSize: 16, lineHeight: 24 },
});
