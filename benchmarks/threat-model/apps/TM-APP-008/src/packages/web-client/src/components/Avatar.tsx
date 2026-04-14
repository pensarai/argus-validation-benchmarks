import React from 'react';

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getColor(name: string): string {
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

export default function Avatar({ name, avatarUrl, size = 'md' }: AvatarProps): React.ReactElement {
  const sizeMap = { sm: 32, md: 40, lg: 56 };
  const px = sizeMap[size];

  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className={`avatar avatar--${size}`} style={{ width: px, height: px, borderRadius: '50%' }} />;
  }

  return (
    <div className={`avatar avatar--${size}`} style={{ width: px, height: px, borderRadius: '50%', backgroundColor: getColor(name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: px * 0.4 }}>
      {getInitials(name)}
    </div>
  );
}
