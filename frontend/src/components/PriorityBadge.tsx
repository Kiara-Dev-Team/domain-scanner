import React from 'react';
import { Priority } from '../types';

interface Props {
  priority: Priority;
}

const priorityConfig = {
  [Priority.IMMEDIATE]: {
    label: 'Critical',
    className: 'badge-immediate',
    icon: '🔴',
  },
  [Priority.HIGH]: {
    label: 'High Priority',
    className: 'badge-high',
    icon: '🟡',
  },
  [Priority.MEDIUM]: {
    label: 'Medium',
    className: 'badge-medium',
    icon: '🔵',
  },
  [Priority.LOW]: {
    label: 'Low',
    className: 'badge-low',
    icon: '⚪',
  },
};

export const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const config = priorityConfig[priority];
  
  return (
    <span className={`badge ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};
