import React from 'react';

interface StatCardProps { title: string; value: number | string; trend?: { direction: 'up' | 'down'; percentage: number }; }

export default function StatCard({ title, value, trend }: StatCardProps): React.ReactElement {
  return (
    <div className="stat-card">
      <h4 className="stat-title">{title}</h4>
      <div className="stat-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {trend && (
        <div className={`stat-trend trend-${trend.direction}`}>
          <span>{trend.direction === 'up' ? '+' : '-'}{trend.percentage}%</span>
          <span className="trend-arrow">{trend.direction === 'up' ? 'Up' : 'Down'}</span>
        </div>
      )}
    </div>
  );
}
