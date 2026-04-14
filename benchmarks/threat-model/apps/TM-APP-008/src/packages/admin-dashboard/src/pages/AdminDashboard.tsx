import React from 'react';
import { useAnalytics } from '../api/hooks/useAnalytics';
import { useAuditLogs } from '../api/hooks/useAuditLogs';
import StatCard from '../components/StatCard';
import { UserGrowthChart, TaskDistributionChart } from '../components/Charts';
import AuditLogEntry from '../components/AuditLogEntry';

const mockGrowthData = [
  { date: 'Jan', users: 50, activeUsers: 40 },
  { date: 'Feb', users: 80, activeUsers: 65 },
  { date: 'Mar', users: 120, activeUsers: 95 },
  { date: 'Apr', users: 150, activeUsers: 120 },
];

const mockTaskData = [
  { status: 'Todo', count: 45 },
  { status: 'In Progress', count: 30 },
  { status: 'In Review', count: 15 },
  { status: 'Done', count: 60 },
];

export default function AdminDashboard(): React.ReactElement {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: auditLogs } = useAuditLogs({ limit: 5 });

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <StatCard title="Total Users" value={analytics?.totalUsers || 0} trend={{ direction: 'up', percentage: 12 }} />
        <StatCard title="Active Projects" value={analytics?.totalProjects || 0} trend={{ direction: 'up', percentage: 8 }} />
        <StatCard title="Tasks This Week" value={0} />
        <StatCard title="New Signups" value={analytics?.totalUsers || 0} trend={{ direction: 'up', percentage: 15 }} />
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <h3>User Growth</h3>
          <UserGrowthChart data={mockGrowthData} />
        </div>
        <div className="chart-container">
          <h3>Task Distribution</h3>
          <TaskDistributionChart data={mockTaskData} />
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Audit Log Entries</h3>
        {(Array.isArray(auditLogs) ? auditLogs.slice(0, 5) : []).map((log: any) => (
          <AuditLogEntry key={log.id} id={log.id} action={log.action} resource={log.resource} userId={log.userId} userName={log.user?.name || 'System'} ip={log.ip} details={log.details} createdAt={log.createdAt} />
        ))}
      </div>
    </div>
  );
}
