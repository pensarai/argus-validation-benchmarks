import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface NotificationItemProps { id: string; title: string; message: string; type: string; read: boolean; timestamp: string; onPress: () => void; }

export default function NotificationItem({ title, message, type, read, timestamp, onPress }: NotificationItemProps): React.ReactElement {
  const typeIcons: Record<string, string> = { task: 'T', project: 'P', comment: 'C', system: 'S' };
  return (
    <TouchableOpacity style={[styles.item, !read && styles.unread]} onPress={onPress}>
      <View style={styles.icon}><Text style={styles.iconText}>{typeIcons[type] || 'N'}</Text></View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.message} numberOfLines={2}>{message}</Text>
        <Text style={styles.timestamp}>{new Date(timestamp).toLocaleString()}</Text>
      </View>
      {!read && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  unread: { backgroundColor: '#f0f8ff' },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm },
  iconText: { color: '#fff', fontWeight: 'bold' },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: colors.text },
  message: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  timestamp: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, alignSelf: 'center' },
});
