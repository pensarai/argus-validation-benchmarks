import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface TaskCardProps { id: string; title: string; priority: string; status: string; assignee?: { name: string; avatarUrl: string | null } | null; dueDate?: string | null; onPress?: () => void; }

export default function TaskCard({ title, priority, status, assignee, dueDate, onPress }: TaskCardProps): React.ReactElement {
  const priorityColors: Record<string, string> = { low: colors.textMuted, medium: colors.primary, high: '#f39c12', critical: colors.danger };
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={[styles.priority, { color: priorityColors[priority] || colors.textMuted }]}>{priority}</Text>
      </View>
      <View style={styles.footer}>
        {assignee && <Avatar name={assignee.name} avatarUrl={assignee.avatarUrl} size={24} />}
        <StatusBadge status={status} />
        {dueDate && <Text style={styles.due}>{new Date(dueDate).toLocaleDateString()}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, padding: spacing.md, marginBottom: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '500', color: colors.text, flex: 1, marginRight: spacing.sm },
  priority: { fontSize: 12, fontWeight: '600' },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.sm },
  due: { fontSize: 12, color: colors.textMuted },
});
