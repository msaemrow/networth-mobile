import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function Card({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderColor: '#dfe5e1', borderRadius: 18, borderWidth: 1, gap: 12, padding: 18 },
  heading: { gap: 3 }, title: { color: '#17352d', fontSize: 17, fontWeight: '700' },
  subtitle: { color: '#69756f', fontSize: 13, lineHeight: 18 },
});
