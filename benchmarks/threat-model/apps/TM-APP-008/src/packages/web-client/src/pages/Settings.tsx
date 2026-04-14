import React, { useState } from 'react';
import { useCurrentUser, useUpdateProfile } from '../api/hooks/useUsers';
import { UserSettingsSchema, NotificationSettingsSchema } from '@app/shared-types';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Settings(): React.ReactElement {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const [theme, setTheme] = useState<string>('system');
  const [language, setLanguage] = useState<string>('en');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;

  const handleSaveSettings = async () => {
    setMessage(null);
    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        data: {
          timezone,
          locale: language,
          notificationPrefs: { email: emailNotifs, push: pushNotifs, inApp: inAppNotifs },
        },
      });
      setMessage('Settings saved');
    } catch (err: any) {
      setMessage('Failed to save settings');
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      {message && <div className="alert">{message}</div>}

      <section className="settings-section">
        <h2>Appearance</h2>
        <div className="form-group">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="form-group">
          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div className="form-group">
          <label>Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern</option>
            <option value="America/Chicago">Central</option>
            <option value="America/Los_Angeles">Pacific</option>
            <option value="Europe/London">London</option>
          </select>
        </div>
      </section>

      <section className="settings-section">
        <h2>Notifications</h2>
        <label className="toggle-label"><input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} /> Email notifications</label>
        <label className="toggle-label"><input type="checkbox" checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} /> Push notifications</label>
        <label className="toggle-label"><input type="checkbox" checked={inAppNotifs} onChange={(e) => setInAppNotifs(e.target.checked)} /> In-app notifications</label>
      </section>

      <button className="btn btn-primary" onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
}
