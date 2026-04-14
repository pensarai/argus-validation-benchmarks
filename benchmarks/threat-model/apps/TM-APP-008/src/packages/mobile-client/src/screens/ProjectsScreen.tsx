import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useProjects } from '../api/hooks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function ProjectsScreen({ navigation }: any): React.ReactElement {
  const { projects, loading, refetch } = useProjects();
  const [search, setSearch] = useState('');

  const filtered = projects.filter((p: any) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="Search projects..." value={search} onChangeText={setSearch} />
      <FlatList
        data={filtered}
        keyExtractor={(item: any) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProjectDetail', { id: item.id })}>
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.projectDesc} numberOfLines={2}>{item.description || 'No description'}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No projects found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  searchInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md, marginBottom: spacing.md },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: spacing.md, marginBottom: spacing.sm },
  projectName: { fontSize: 16, fontWeight: '600', color: colors.text },
  projectDesc: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  status: { fontSize: 12, color: colors.primary, marginTop: 8 },
  empty: { textAlign: 'center', color: colors.textMuted, padding: spacing.xl },
});
