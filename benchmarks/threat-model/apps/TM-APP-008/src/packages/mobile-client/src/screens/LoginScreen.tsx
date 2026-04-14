import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLogin } from '../api/hooks';
import { LoginSchema } from '@app/shared-types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function LoginScreen({ navigation }: any): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();

  const handleLogin = async () => {
    try {
      const validation = LoginSchema.safeParse({ email, password });
      if (!validation.success) {
        Alert.alert('Error', validation.error.errors[0].message);
        return;
      }
      await login(email, password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ProjectHub</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl },
  error: { color: colors.danger, textAlign: 'center', marginBottom: spacing.md },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md, marginBottom: spacing.md, fontSize: 16 },
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: colors.primary, textAlign: 'center', fontSize: 14 },
});
