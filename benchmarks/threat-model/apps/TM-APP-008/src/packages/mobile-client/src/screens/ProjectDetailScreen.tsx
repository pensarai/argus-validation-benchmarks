import React from 'react';
import { View, Text, FlatList, SectionList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTasks } from '../api/hooks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function ProjectDetailScreen({ route, navigation }: any): React.ReactElement {
  const { id } = route.params;
  const { tasks, loading, refetch } = useTasks(id);

  const sections = [
    { title: 'To Do', data: tasks.filter((t: any) => t.status === 'todo') },
    { title: 'In Progress', data: tasks.filter((t: any) => t.status === 'in_progress') },
    { title: 'In Review', data: tasks.filter((t: any) => t.status === 'in_review') },
    { title: 'Done', data: tasks.filter((t: any) => t.status === 'done') },
  ].filter((s) => s.data.length > 0);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item: any) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title} ({section.data.length})</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <View style={styles.taskMeta}>
              <Text style={[styles.priority, { color: item.priority === 'high' || item.priority === 'critical' ? colors.danger : colors.textMuted }]}>{item.priority}</Text>
              {item.dueDate && <Text style={styles.dueDate}>{new Date(item.dueDate).toLocaleDateString()}</Text>}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks in this project</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  sectionHeader: { fontSize: 16, fontWeight: '600', color: colors.text, padding: spacing.md, backgroundColor: colors.background },
  taskCard: { backgroundColor: '#fff', borderRadius: 8, padding: spacing.md, marginHorizontal: spacing.md, marginBottom: spacing.sm },
  taskTitle: { fontSize: 14, fontWeight: '500', color: colors.text },
  taskMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  priority: { fontSize: 12 },
  dueDate: { fontSize: 12, color: colors.textMuted },
  empty: { textAlign: 'center', color: colors.textMuted, padding: spacing.xl },
});
