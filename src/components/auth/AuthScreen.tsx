import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AuthScreen({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle: string }>) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}><Text style={styles.brandText}>Networth</Text></View>
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const authStyles = StyleSheet.create({
  form: { gap: 16, marginTop: 24 },
  label: { color: '#34443e', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderColor: '#cad3ce', borderRadius: 10, borderWidth: 1, color: '#17352d', fontSize: 16, minHeight: 50, paddingHorizontal: 14 },
  button: { alignItems: 'center', backgroundColor: '#28735b', borderRadius: 11, marginTop: 4, minHeight: 50, justifyContent: 'center', paddingHorizontal: 18 },
  buttonDisabled: { opacity: .6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  error: { backgroundColor: '#fdeceb', borderRadius: 9, color: '#9b2f2f', fontSize: 13, lineHeight: 19, padding: 12 },
  help: { color: '#74817b', fontSize: 12, lineHeight: 17, marginTop: -8 },
  footer: { color: '#69756f', fontSize: 14, marginTop: 22, textAlign: 'center' },
  link: { color: '#28735b', fontWeight: '800' },
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { backgroundColor: '#f7f8f4', flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  brand: { alignItems: 'center', marginBottom: 24 },
  brandText: { color: '#28735b', fontSize: 22, fontWeight: '900', letterSpacing: -.5 },
  card: { backgroundColor: '#fff', borderColor: '#e0e6e2', borderRadius: 18, borderWidth: 1, padding: 24 },
  title: { color: '#17352d', fontSize: 30, fontWeight: '900', letterSpacing: -.8 },
  subtitle: { color: '#69756f', fontSize: 15, lineHeight: 22, marginTop: 7 },
});
