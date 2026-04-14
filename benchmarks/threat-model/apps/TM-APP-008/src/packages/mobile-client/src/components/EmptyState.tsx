import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface EmptyStateProps { title: string; description: string; actionLabel?: string; onAction?: () => void; }

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: spacing.xl },
  title: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  description: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md },
  button: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
