import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ProjectCardProps { id: string; name: string; description?: string | null; taskCount: number; updatedAt: string; onPress: () => void; }

export default function ProjectCard({ name, description, taskCount, updatedAt, onPress }: ProjectCardProps): React.ReactElement {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{name}</Text>
      {description && <Text style={styles.desc} numberOfLines={2}>{description}</Text>}
      <View style={styles.meta}>
        <Text style={styles.metaText}>{taskCount} tasks</Text>
        <Text style={styles.metaText}>{new Date(updatedAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, padding: spacing.md, marginBottom: spacing.sm },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  desc: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  metaText: { fontSize: 12, color: colors.textMuted },
});
