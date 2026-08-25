import { Link, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { AuthScreen, authStyles } from '@/src/components/auth/AuthScreen';
import { PasswordInput } from '@/src/components/ui/PasswordInput';
import { useAuth } from '@/src/auth/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [householdName, setHouseholdName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError('');
    setSubmitting(true);
    try { await register({ email: email.trim(), householdName: householdName.trim(), password, passwordConfirmation }); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to create account'); }
    finally { setSubmitting(false); }
  };

  return (
    <AuthScreen title="Create an account" subtitle="Start a household net worth dashboard.">
      <View style={authStyles.form}>
        <View><Text style={authStyles.label}>Email</Text><TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" style={authStyles.input} value={email} onChangeText={setEmail} /></View>
        <View><Text style={authStyles.label}>Household name</Text><TextInput autoComplete="organization" style={authStyles.input} value={householdName} onChangeText={setHouseholdName} /></View>
        <View><Text style={authStyles.label}>Password</Text><PasswordInput autoCapitalize="none" autoComplete="new-password" value={password} onChangeText={setPassword} /></View>
        <Text style={authStyles.help}>At least 8 characters with a letter, number, and special character.</Text>
        <View><Text style={authStyles.label}>Confirm password</Text><PasswordInput autoCapitalize="none" autoComplete="new-password" value={passwordConfirmation} onChangeText={setPasswordConfirmation} /></View>
        {error ? <Text accessibilityRole="alert" style={authStyles.error}>{error}</Text> : null}
        <Pressable disabled={submitting || !email.trim() || !householdName.trim() || !password || !passwordConfirmation} style={[authStyles.button, submitting && authStyles.buttonDisabled]} onPress={() => void submit()}>
          <Text style={authStyles.buttonText}>{submitting ? 'Creating…' : 'Create account'}</Text>
        </Pressable>
      </View>
      <Text style={authStyles.footer}>Already registered? <Link href={'/login' as Href} style={authStyles.link}>Log in</Link>.</Text>
    </AuthScreen>
  );
}
