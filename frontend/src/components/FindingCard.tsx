import React, { useState } from 'react';
import { BusinessFinding } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { RiskTypeIcon } from './RiskTypeIcon';

interface Props {
  finding: BusinessFinding;
}

export const FindingCard: React.FC<Props> = ({ finding }) => {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <PriorityBadge priority={finding.priority} />
            <RiskTypeIcon riskType={finding.riskType} />
          </div>
        </div>
      </div>

      {/* Business Description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">What we found:</h3>
        <p className="text-gray-700">{finding.businessDescription}</p>
      </div>

      {/* Business Impact */}
      {finding.businessImpact.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-900 mb-2">Business Impact:</h4>
          <ul className="list-disc list-inside space-y-1">
            {finding.businessImpact.map((impact, idx) => (
              <li key={idx} className="text-gray-700">{impact}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      {finding.actions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-900 mb-2">What to do next:</h4>
          <div className="space-y-2">
            {finding.actions.map((action, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-900 font-medium">{action.description}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>👤 Owner: {action.owner}</span>
                  <span>⏱️ Timeline: {action.timeframe}</span>
                  <span>🔧 Complexity: {action.complexity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Details Toggle */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          {showTechnical ? '▼' : '▶'} View Technical Details
        </button>

        {showTechnical && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Template ID:</span> {finding.technical.templateId}
              </div>
              <div>
                <span className="font-semibold">Technical Name:</span> {finding.technical.name}
              </div>
              <div>
                <span className="font-semibold">Severity:</span> {finding.technical.severity}
              </div>
              <div>
                <span className="font-semibold">Host:</span> {finding.technical.host}
              </div>
              <div>
                <span className="font-semibold">Matched At:</span> {finding.technical.matchedAt}
              </div>
              {finding.technical.description && (
                <div>
                  <span className="font-semibold">Description:</span> {finding.technical.description}
                </div>
              )}
              {finding.technical.tags.length > 0 && (
                <div>
                  <span className="font-semibold">Tags:</span> {finding.technical.tags.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
