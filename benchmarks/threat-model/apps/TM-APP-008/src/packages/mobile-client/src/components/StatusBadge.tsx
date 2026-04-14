import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const statusColors: Record<string, string> = { todo: '#bdc3c7', in_progress: '#3498db', in_review: '#f1c40f', done: '#2ecc71', cancelled: '#e74c3c' };

interface StatusBadgeProps { status: string; }

export default function StatusBadge({ status }: StatusBadgeProps): React.ReactElement {
  const bg = statusColors[status] || '#95a5a6';
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.text}>{status.replace(/_/g, ' ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  text: { color: '#fff', fontSize: 11, fontWeight: '600' },
});
