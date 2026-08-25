import { StyleSheet, Text, View } from 'react-native';

export function Metric({ label, value, description, highlight = false }: { label: string; value: string; description?: string; highlight?: boolean }) {
  return (
    <View style={[styles.metric, highlight && styles.highlight]}>
      <Text style={[styles.label, highlight && styles.mutedHighlight]}>{label}</Text>
      <Text style={[styles.value, highlight && styles.textHighlight]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      {description ? <Text style={[styles.description, highlight && styles.mutedHighlight]}>{description}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  metric: { backgroundColor: '#fff', borderColor: '#dfe5e1', borderRadius: 18, borderWidth: 1, gap: 6, padding: 18 },
  highlight: { backgroundColor: '#17352d', borderColor: '#17352d' }, label: { color: '#69756f', fontSize: 13, fontWeight: '600' },
  value: { color: '#17352d', fontSize: 28, fontWeight: '800' }, description: { color: '#69756f', fontSize: 12, lineHeight: 17 },
  textHighlight: { color: '#fff' }, mutedHighlight: { color: '#c9d8d2' },
});
