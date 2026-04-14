import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface AvatarProps { name: string; avatarUrl?: string | null; size?: number; }

function getInitials(name: string): string { return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2); }
function getColor(name: string): string { const c = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']; return c[name.charCodeAt(0) % c.length]; }

export default function Avatar({ name, avatarUrl, size = 40 }: AvatarProps): React.ReactElement {
  if (avatarUrl) {
    return <Image source={{ uri: avatarUrl }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />;
  }
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2, backgroundColor: getColor(name) }]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { },
  fallback: { justifyContent: 'center', alignItems: 'center' },
  initials: { color: '#fff', fontWeight: 'bold' },
});
