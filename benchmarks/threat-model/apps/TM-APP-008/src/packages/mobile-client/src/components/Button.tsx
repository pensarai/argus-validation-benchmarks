import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ButtonProps { title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger'; loading?: boolean; disabled?: boolean; style?: ViewStyle; }

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }: ButtonProps): React.ReactElement {
  const bgColors = { primary: colors.primary, secondary: colors.secondary, danger: colors.danger };
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: bgColors[variant] }, disabled && styles.disabled, style]} onPress={onPress} disabled={disabled || loading}>
      {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: 8, padding: spacing.md, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.6 },
});
