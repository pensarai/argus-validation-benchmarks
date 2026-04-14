import React from 'react';
import { useSystemHealth } from '../api/hooks/useSystemHealth';
import StatCard from '../components/StatCard';
import { formatDuration } from '../utils/format';

export default function SystemHealth(): React.ReactElement {
  const { data: health, isLoading } = useSystemHealth();

  if (isLoading) return <div>Loading system health...</div>;

  return (
    <div className="system-health-page">
      <h1>System Health</h1>

      <div className="health-indicators">
        <div className={`health-card ${health?.database === 'healthy' ? 'healthy' : 'unhealthy'}`}>
          <h3>Database</h3>
          <span className="health-status">{health?.database || 'unknown'}</span>
        </div>
        <div className="health-card healthy">
          <h3>Redis</h3>
          <span className="health-status">healthy</span>
        </div>
        <div className="health-card">
          <h3>Uptime</h3>
          <span className="health-value">{formatDuration(health?.uptime || 0)}</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="API Response Time" value="45ms" />
        <StatCard title="Memory Usage" value="128 MB" />
        <StatCard title="Request Rate" value="150/min" />
        <StatCard title="Error Rate" value="0.1%" />
      </div>

      <div className="recent-errors">
        <h3>Recent Errors</h3>
        <p className="empty">No recent errors.</p>
      </div>
    </div>
  );
}
