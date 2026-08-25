import { Link, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { AuthScreen, authStyles } from '@/src/components/auth/AuthScreen';
import { PasswordInput } from '@/src/components/ui/PasswordInput';
import { useAuth } from '@/src/auth/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError('');
    setSubmitting(true);
    try { await login({ email: email.trim(), password }); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to log in'); }
    finally { setSubmitting(false); }
  };

  return (
    <AuthScreen title="Log in" subtitle="Access your household’s net worth dashboard.">
      <View style={authStyles.form}>
        <View><Text style={authStyles.label}>Email</Text><TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" style={authStyles.input} value={email} onChangeText={setEmail} /></View>
        <View><Text style={authStyles.label}>Password</Text><PasswordInput autoCapitalize="none" autoComplete="current-password" value={password} onChangeText={setPassword} /></View>
        {error ? <Text accessibilityRole="alert" style={authStyles.error}>{error}</Text> : null}
        <Pressable disabled={submitting || !email.trim() || !password} style={[authStyles.button, submitting && authStyles.buttonDisabled]} onPress={() => void submit()}>
          <Text style={authStyles.buttonText}>{submitting ? 'Logging in…' : 'Log in'}</Text>
        </Pressable>
      </View>
      <Text style={authStyles.footer}>New here? <Link href={'/register' as Href} style={authStyles.link}>Create an account</Link>.</Text>
    </AuthScreen>
  );
}
