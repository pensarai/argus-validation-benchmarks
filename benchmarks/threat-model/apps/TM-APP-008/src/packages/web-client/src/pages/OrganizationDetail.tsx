import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOrganization, useUpdateOrganization, useAddMember, useRemoveMember } from '../api/hooks/useOrganizations';
import LoadingSpinner from '../components/LoadingSpinner';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';

type Tab = 'settings' | 'members' | 'projects' | 'invites';

export default function OrganizationDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { data: org, isLoading } = useOrganization(id!);
  const updateOrg = useUpdateOrganization();
  const addMember = useAddMember();
  const removeMember = useRemoveMember();
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  if (isLoading) return <LoadingSpinner />;
  if (!org) return <div>Organization not found</div>;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'settings', label: 'Settings' },
    { key: 'members', label: 'Members' },
    { key: 'projects', label: 'Projects' },
    { key: 'invites', label: 'Invites' },
  ];

  return (
    <div className="org-detail-page">
      <div className="org-header">
        <h1>{org.name}</h1>
        <p>{org.description || 'No description'}</p>
      </div>
      <nav className="tabs">
        {tabs.map((tab) => (
          <button key={tab.key} className={`tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="tab-content">
        {activeTab === 'settings' && (
          <div className="org-settings">
            <div className="form-group"><label>Name</label><input defaultValue={org.name} /></div>
            <div className="form-group"><label>Description</label><textarea defaultValue={org.description || ''} /></div>
            <button className="btn btn-primary" onClick={() => {}}>Save Changes</button>
          </div>
        )}
        {activeTab === 'members' && (
          <div className="org-members">
            <h3>Members ({org.memberIds?.length || 0})</h3>
            <div className="member-list">
              {(org.memberIds || []).map((memberId: string) => (
                <div key={memberId} className="member-item">
                  <span>{memberId}</span>
                  <button className="btn btn-sm btn-danger" onClick={() => removeMember.mutate({ orgId: id!, userId: memberId })}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'projects' && (
          <div className="org-projects">
            <h3>Projects</h3>
            {(org.projects || []).map((p: any) => (
              <div key={p.id} className="project-list-item">
                <span>{p.name}</span>
                <Badge variant="status" value={p.status} />
              </div>
            ))}
          </div>
        )}
        {activeTab === 'invites' && (
          <div className="org-invites">
            <h3>Send Invite</h3>
            <div className="invite-form">
              <input placeholder="Email address" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} />
              <button className="btn btn-primary">Send Invite</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
