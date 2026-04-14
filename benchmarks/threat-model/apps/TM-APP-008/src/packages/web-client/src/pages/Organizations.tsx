import React, { useState } from 'react';
import { useOrganizations, useCreateOrganization } from '../api/hooks/useOrganizations';
import { generateSlug } from '@app/shared-types';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Organizations(): React.ReactElement {
  const { data: orgs, isLoading } = useOrganizations();
  const createOrg = useCreateOrganization();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const handleNameChange = (v: string) => { setName(v); setSlug(generateSlug(v)); };

  const handleCreate = async () => {
    try {
      await createOrg.mutateAsync({ name, slug, description: description || undefined });
      setShowCreate(false);
      setName(''); setSlug(''); setDescription('');
    } catch {}
  };

  if (isLoading) return <LoadingSpinner />;

  const orgList = Array.isArray(orgs) ? orgs : [];

  return (
    <div className="organizations-page">
      <div className="page-header">
        <h1>Organizations</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Create Organization</button>
      </div>
      <div className="org-grid">
        {orgList.length === 0 ? (
          <p>No organizations. Create one to get started.</p>
        ) : (
          orgList.map((org: any) => (
            <div key={org.id} className="org-card">
              <h3>{org.name}</h3>
              <p>{org.description || 'No description'}</p>
              <span>{org.memberIds?.length || 0} members</span>
            </div>
          ))
        )}
      </div>
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Organization"
        actions={<><button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCreate} disabled={createOrg.isPending}>{createOrg.isPending ? 'Creating...' : 'Create'}</button></>}>
        <div className="form-group"><label>Name</label><input value={name} onChange={(e) => handleNameChange(e.target.value)} /></div>
        <div className="form-group"><label>Slug</label><input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
        <div className="form-group"><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      </Modal>
    </div>
  );
}
