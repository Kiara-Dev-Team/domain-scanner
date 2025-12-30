import React from 'react';
import { ScanResult } from '../types';

interface Props {
  result: ScanResult;
}

export const ExecutiveSummary: React.FC<Props> = ({ result }) => {
  const { summary } = result;
  const totalFindings = summary.immediate + summary.high + summary.medium + summary.low;

  const getPostureStatus = () => {
    if (summary.immediate > 0) {
      return { text: 'NEEDS IMMEDIATE ATTENTION', color: 'bg-danger-500', icon: '⚠️' };
    }
    if (summary.high > 0) {
      return { text: 'ACTION REQUIRED', color: 'bg-warning-500', icon: '⚡' };
    }
    if (summary.medium > 0) {
      return { text: 'REVIEW NEEDED', color: 'bg-primary-500', icon: '📋' };
    }
    if (totalFindings === 0) {
      return { text: 'ALL CLEAR', color: 'bg-success-500', icon: '✅' };
    }
    return { text: 'GOOD', color: 'bg-success-500', icon: '👍' };
  };

  const posture = getPostureStatus();

  return (
    <div className="card bg-gradient-to-br from-white to-gray-50">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-2 ${posture.color} text-white px-6 py-3 rounded-lg text-xl font-bold mb-4`}>
          <span>{posture.icon}</span>
          <span>Security Posture: {posture.text}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-danger-600">{summary.immediate}</div>
          <div className="text-sm text-gray-600">Critical Issues</div>
          <div className="text-xs text-gray-500">Immediate action</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-warning-600">{summary.high}</div>
          <div className="text-sm text-gray-600">High Priority</div>
          <div className="text-xs text-gray-500">Action this week</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-primary-600">{summary.medium}</div>
          <div className="text-sm text-gray-600">Medium Issues</div>
          <div className="text-xs text-gray-500">Plan to address</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-gray-600">{summary.low}</div>
          <div className="text-sm text-gray-600">Low Priority</div>
          <div className="text-xs text-gray-500">Monitor</div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">Risk Breakdown by Type</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <span className="text-2xl">💰</span>
            <div>
              <div className="font-semibold text-gray-900">{summary.byRiskType.financial}</div>
              <div className="text-sm text-gray-600">Financial Risks</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <span className="text-2xl">⚖️</span>
            <div>
              <div className="font-semibold text-gray-900">{summary.byRiskType.governance}</div>
              <div className="text-sm text-gray-600">Compliance Risks</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <span className="text-2xl">⚙️</span>
            <div>
              <div className="font-semibold text-gray-900">{summary.byRiskType.operational}</div>
              <div className="text-sm text-gray-600">Operational Risks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
