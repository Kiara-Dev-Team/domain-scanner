import React from 'react';
import { RiskType } from '../types';

interface Props {
  riskType: RiskType;
}

const riskTypeConfig = {
  [RiskType.FINANCIAL]: {
    label: 'Financial Risk',
    icon: '💰',
    color: 'text-danger-700',
  },
  [RiskType.GOVERNANCE]: {
    label: 'Compliance Risk',
    icon: '⚖️',
    color: 'text-warning-700',
  },
  [RiskType.OPERATIONAL]: {
    label: 'Operational Risk',
    icon: '⚙️',
    color: 'text-primary-700',
  },
};

export const RiskTypeIcon: React.FC<Props> = ({ riskType }) => {
  const config = riskTypeConfig[riskType];
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">{config.icon}</span>
      <span className={`font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
};
