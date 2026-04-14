import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface CardProps { children: React.ReactNode; title?: string; action?: { label: string; onPress: () => void }; style?: ViewStyle; onPress?: () => void; }

export default function Card({ children, title, action, style, onPress }: CardProps): React.ReactElement {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={[styles.card, style]} onPress={onPress}>
      {(title || action) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {action && <TouchableOpacity onPress={action.onPress}><Text style={styles.action}>{action.label}</Text></TouchableOpacity>}
        </View>
      )}
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  title: { fontSize: 16, fontWeight: '600', color: colors.text },
  action: { fontSize: 14, color: colors.primary, fontWeight: '500' },
});
