import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface InputProps extends TextInputProps { label?: string; error?: string; maxChars?: number; }

export default function Input({ label, error, maxChars, secureTextEntry, value, ...props }: InputProps): React.ReactElement {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        <TextInput style={[styles.input, error && styles.inputError]} secureTextEntry={secureTextEntry && !showPassword} value={value} {...props} />
        {secureTextEntry && (
          <TouchableOpacity style={styles.toggle} onPress={() => setShowPassword(!showPassword)}>
            <Text>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {maxChars && value && <Text style={styles.counter}>{(value as string).length}/{maxChars}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md, fontSize: 16 },
  inputError: { borderColor: colors.danger },
  toggle: { position: 'absolute', right: 12 },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
  counter: { color: colors.textMuted, fontSize: 11, textAlign: 'right', marginTop: 2 },
});
