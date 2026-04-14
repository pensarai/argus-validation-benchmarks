import { Platform, Dimensions } from 'react-native';

export function isIOS(): boolean { return Platform.OS === 'ios'; }
export function isAndroid(): boolean { return Platform.OS === 'android'; }

export function getDeviceInfo() {
  const { width, height } = Dimensions.get('window');
  return { platform: Platform.OS, version: Platform.Version, width, height, isTablet: Math.min(width, height) >= 600 };
}

export function getAppVersion(): string { return '1.0.0'; }

export function hasNotch(): boolean {
  const { height, width } = Dimensions.get('window');
  return isIOS() && (height >= 812 || width >= 812);
}
