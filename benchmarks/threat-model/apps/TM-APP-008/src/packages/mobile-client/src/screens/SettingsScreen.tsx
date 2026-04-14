import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLogout } from '../api/hooks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function SettingsScreen({ navigation }: any): React.ReactElement {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const logout = useLogout();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Push Notifications</Text>
        <Switch value={pushNotifications} onValueChange={setPushNotifications} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Email Notifications</Text>
        <Switch value={emailNotifications} onValueChange={setEmailNotifications} />
      </View>

      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>ProjectHub Mobile v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: spacing.md, borderRadius: 8, marginBottom: spacing.sm },
  settingLabel: { fontSize: 16, color: colors.text },
  logoutButton: { backgroundColor: colors.danger, borderRadius: 8, padding: spacing.md, alignItems: 'center', marginTop: spacing.xl },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  version: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.lg, fontSize: 12 },
});
