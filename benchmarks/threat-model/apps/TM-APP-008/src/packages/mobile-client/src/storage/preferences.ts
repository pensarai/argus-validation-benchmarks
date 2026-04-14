import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFS_KEY = 'app_preferences';

interface Preferences { theme: 'light' | 'dark' | 'system'; language: string; notificationsEnabled: boolean; onboardingCompleted: boolean; }

const defaults: Preferences = { theme: 'system', language: 'en', notificationsEnabled: true, onboardingCompleted: false };

export async function getPreferences(): Promise<Preferences> {
  const raw = await AsyncStorage.getItem(PREFS_KEY);
  if (!raw) return defaults;
  try { return { ...defaults, ...JSON.parse(raw) }; } catch { return defaults; }
}

export async function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]): Promise<void> {
  const prefs = await getPreferences();
  prefs[key] = value;
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export async function resetPreferences(): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(defaults));
}
