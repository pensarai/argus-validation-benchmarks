import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTasks } from '../api/hooks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const STATUS_CHIPS = ['all', 'todo', 'in_progress', 'in_review', 'done'];
const PRIORITY_CHIPS = ['all', 'low', 'medium', 'high', 'critical'];

export default function TasksScreen(): React.ReactElement {
  const { tasks, loading, refetch } = useTasks();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = tasks
    .filter((t: any) => statusFilter === 'all' || t.status === statusFilter)
    .filter((t: any) => priorityFilter === 'all' || t.priority === priorityFilter);

  return (
    <View style={styles.container}>
      <View style={styles.chipRow}>
        {STATUS_CHIPS.map((s) => (
          <TouchableOpacity key={s} style={[styles.chip, statusFilter === s && styles.chipActive]} onPress={() => setStatusFilter(s)}>
            <Text style={[styles.chipText, statusFilter === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item: any) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <View style={styles.taskMeta}>
              <Text style={styles.status}>{item.status.replace(/_/g, ' ')}</Text>
              <Text style={styles.priority}>{item.priority}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks match filters</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md, gap: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#e0e0e0' },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 12, color: colors.text },
  chipTextActive: { color: '#fff' },
  taskCard: { backgroundColor: '#fff', borderRadius: 8, padding: spacing.md, marginBottom: spacing.sm },
  taskTitle: { fontSize: 14, fontWeight: '500', color: colors.text },
  taskMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  status: { fontSize: 12, color: colors.primary },
  priority: { fontSize: 12, color: colors.textMuted },
  empty: { textAlign: 'center', color: colors.textMuted, padding: spacing.xl },
});
