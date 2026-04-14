import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { mobileApiClient } from '../api/client';
import { RegisterSchema } from '@app/shared-types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function RegisterScreen({ navigation }: any): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (): string => {
    if (password.length < 8) return 'Too short';
    const checks = [/[A-Z]/, /[a-z]/, /\d/, /[!@#$%^&*]/].filter((r) => r.test(password)).length;
    if (checks <= 2) return 'Weak';
    if (checks === 3) return 'Good';
    return 'Strong';
  };

  const handleRegister = async () => {
    if (!acceptedTerms) { Alert.alert('Error', 'Please accept terms'); return; }
    const validation = RegisterSchema.safeParse({ email, password, name });
    if (!validation.success) { Alert.alert('Error', validation.error.errors[0].message); return; }
    setLoading(true);
    try {
      await mobileApiClient.post('/api/auth/register', { email, password, name });
      Alert.alert('Success', 'Account created', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {password.length > 0 && <Text style={styles.strength}>Strength: {getPasswordStrength()}</Text>}
      <View style={styles.termsRow}>
        <Switch value={acceptedTerms} onValueChange={setAcceptedTerms} />
        <Text style={styles.termsText}>I accept the Terms of Service</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: spacing.xl, color: colors.text },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md, marginBottom: spacing.md, fontSize: 16 },
  strength: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  termsText: { marginLeft: spacing.sm, fontSize: 14, color: colors.text },
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: colors.primary, textAlign: 'center', fontSize: 14 },
});
