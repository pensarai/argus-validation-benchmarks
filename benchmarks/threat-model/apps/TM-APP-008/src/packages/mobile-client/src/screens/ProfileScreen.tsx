import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { getStoredUser } from '../storage/tokens';
import { useUpdateProfile } from '../api/hooks';
import { UserUpdateSchema } from '@app/shared-types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function ProfileScreen(): React.ReactElement {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const { update, loading } = useUpdateProfile();

  useEffect(() => {
    getStoredUser().then((u) => { if (u) { setUser(u); setName(u.name); } });
  }, []);

  const handleSave = async () => {
    if (!user) return;
    const data = { name, displayName: displayName || undefined, bio: bio || undefined };
    const validation = UserUpdateSchema.safeParse(data);
    if (!validation.success) { Alert.alert('Error', validation.error.errors[0].message); return; }
    try {
      await update(user.id, data);
      Alert.alert('Success', 'Profile updated');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text></View>
        <Text style={styles.roleBadge}>{user?.role || 'user'}</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Display Name</Text>
        <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} placeholder="Optional" />
        <Text style={styles.label}>Bio</Text>
        <TextInput style={[styles.input, styles.multiline]} value={bio} onChangeText={setBio} multiline numberOfLines={4} maxLength={500} />
        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  avatarSection: { alignItems: 'center', padding: spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  roleBadge: { marginTop: spacing.sm, fontSize: 12, color: colors.textMuted, backgroundColor: colors.border, paddingHorizontal: 12, paddingVertical: 2, borderRadius: 10 },
  form: { padding: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md, marginBottom: spacing.md, fontSize: 16 },
  multiline: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: spacing.md, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
