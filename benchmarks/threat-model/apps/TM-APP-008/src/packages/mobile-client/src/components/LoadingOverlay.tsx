import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface LoadingOverlayProps { message?: string; visible?: boolean; }

export default function LoadingOverlay({ message, visible = true }: LoadingOverlayProps): React.ReactElement | null {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  message: { marginTop: 12, fontSize: 14, color: colors.text },
});
