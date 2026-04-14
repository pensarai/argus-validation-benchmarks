import React, { useState } from 'react';

interface AuditLogEntryProps { id: string; action: string; resource: string; userId: string; userName: string; ip: string | null; details: Record<string, unknown>; createdAt: string; }

export default function AuditLogEntry({ action, resource, userName, ip, details, createdAt }: AuditLogEntryProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="audit-entry" onClick={() => setExpanded(!expanded)}>
      <div className="audit-row">
        <span className="audit-time">{new Date(createdAt).toLocaleString()}</span>
        <span className="audit-user">{userName}</span>
        <span className="audit-action">{action}</span>
        <span className="audit-resource">{resource}</span>
        {ip && <span className="audit-ip">{ip}</span>}
      </div>
      {expanded && (
        <pre className="audit-details">{JSON.stringify(details, null, 2)}</pre>
      )}
    </div>
  );
}
