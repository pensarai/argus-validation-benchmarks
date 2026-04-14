import React, { useState } from 'react';
import { useAuditLogs } from '../api/hooks/useAuditLogs';
import AuditLogEntry from '../components/AuditLogEntry';
import DataTable from '../components/DataTable';

export default function AuditLogs(): React.ReactElement {
  const [offset, setOffset] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: logs, isLoading } = useAuditLogs({ limit: 50, offset });

  const actions = ['user.created', 'user.updated', 'user.login', 'project.created', 'task.created', 'task.status_changed', 'webhook.tested'];

  const filteredLogs = (Array.isArray(logs) ? logs : [])
    .filter((l: any) => !actionFilter || l.action === actionFilter)
    .filter((l: any) => !searchQuery || JSON.stringify(l).toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="audit-logs-page">
      <h1>Audit Logs</h1>
      <div className="filters-bar">
        <input placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
          <option value="">All actions</option>
          {actions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <button className="btn btn-secondary">Export CSV</button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="audit-list">
          {filteredLogs.map((log: any) => (
            <AuditLogEntry key={log.id} id={log.id} action={log.action} resource={log.resource} userId={log.userId} userName={log.user?.name || 'System'} ip={log.ip} details={log.details || {}} createdAt={log.createdAt} />
          ))}
          {filteredLogs.length === 0 && <p className="empty">No audit log entries found.</p>}
        </div>
      )}
    </div>
  );
}
