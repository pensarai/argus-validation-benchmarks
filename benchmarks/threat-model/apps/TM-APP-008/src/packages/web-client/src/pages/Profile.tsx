import React, { useState, useEffect } from 'react';
import { useCurrentUser, useUpdateProfile } from '../api/hooks/useUsers';
import { UserUpdateSchema } from '@app/shared-types';
import Avatar from '../components/Avatar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile(): React.ReactElement {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
    }
  }, [user]);

  if (isLoading) return <LoadingSpinner />;

  const handleSave = async () => {
    setMessage(null);
    const data = { name, displayName: displayName || undefined, bio: bio || undefined, metadata: user?.metadata };
    const validation = UserUpdateSchema.safeParse(data);
    if (!validation.success) {
      setMessage('Validation error: ' + validation.error.errors[0].message);
      return;
    }
    try {
      await updateProfile.mutateAsync({ userId: user.id, data });
      setMessage('Profile updated successfully');
    } catch (err: any) {
      setMessage(err.response?.data?.error?.message || 'Update failed');
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-header">
        <Avatar name={user?.name || ''} avatarUrl={user?.avatarUrl} size="lg" />
        <div>
          <h2>{user?.name}</h2>
          <span className="role-label">{user?.role}</span>
        </div>
      </div>
      {message && <div className="alert">{message}</div>}
      <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Display Name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={4} />
        </div>
        <div className="form-group">
          <label>Metadata (read-only)</label>
          <pre className="metadata-display">{JSON.stringify(user?.metadata || {}, null, 2)}</pre>
        </div>
        <button type="submit" className="btn btn-primary" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
