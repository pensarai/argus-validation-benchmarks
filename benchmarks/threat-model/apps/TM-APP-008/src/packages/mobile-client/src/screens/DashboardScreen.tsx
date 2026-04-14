import React from 'react';
import { View, Text, FlatList, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { useProjects, useTasks } from '../api/hooks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function DashboardScreen({ navigation }: any): React.ReactElement {
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjects();
  const { tasks, loading: tasksLoading, refetch: refetchTasks } = useTasks();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchProjects(), refetchTasks()]);
    setRefreshing(false);
  };

  const myTasks = tasks.slice(0, 10);

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statNumber}>{projects.length}</Text><Text style={styles.statLabel}>Projects</Text></View>
        <View style={styles.statCard}><Text style={styles.statNumber}>{tasks.length}</Text><Text style={styles.statLabel}>Tasks</Text></View>
        <View style={styles.statCard}><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>Members</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Recent Projects</Text>
      <FlatList horizontal data={projects.slice(0, 5)} keyExtractor={(item: any) => item.id} showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.projectCard} onPress={() => navigation.navigate('ProjectDetail', { id: item.id })}>
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.projectDesc} numberOfLines={2}>{item.description || 'No description'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No projects yet</Text>}
      />

      <Text style={styles.sectionTitle}>My Tasks</Text>
      {myTasks.map((task: any) => (
        <View key={task.id} style={styles.taskItem}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskStatus}>{task.status}</Text>
        </View>
      ))}
      {myTasks.length === 0 && <Text style={styles.empty}>No tasks assigned</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: spacing.md, marginHorizontal: 4, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textMuted },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.sm, color: colors.text },
  projectCard: { backgroundColor: '#fff', borderRadius: 8, padding: spacing.md, width: 200, marginRight: spacing.sm },
  projectName: { fontSize: 16, fontWeight: '600', color: colors.text },
  projectDesc: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  taskItem: { backgroundColor: '#fff', borderRadius: 8, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', justifyContent: 'space-between' },
  taskTitle: { fontSize: 14, color: colors.text, flex: 1 },
  taskStatus: { fontSize: 12, color: colors.primary },
  empty: { color: colors.textMuted, textAlign: 'center', padding: spacing.lg },
});
