import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scanService } from '../services/api';
import { ScanResult, Priority } from '../types';
import { ExecutiveSummary } from '../components/ExecutiveSummary';
import { FindingCard } from '../components/FindingCard';

export const ScanResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Priority | 'ALL'>('ALL');

  useEffect(() => {
    if (id) {
      loadResults();
      // Poll for updates if scan is still running
      const interval = setInterval(() => {
        if (result?.scan.status === 'RUNNING' || result?.scan.status === 'PENDING') {
          loadResults();
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [id, result?.scan.status]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await scanService.getScanResults(id!);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load scan results');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scan results...</p>
        </div>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Results</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const { scan, findings, summary } = result;

  // Filter findings
  const filteredFindings = filter === 'ALL' 
    ? findings 
    : findings.filter(f => f.priority === filter);

  // Show scanning status
  if (scan.status === 'RUNNING' || scan.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => navigate('/')}
              className="text-primary-600 hover:text-primary-700 font-medium mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{scan.targetDomain}</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Scan in Progress
            </h2>
            <p className="text-gray-600">
              Scanning {scan.targetDomain}... This may take a few minutes.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Show failed status
  if (scan.status === 'FAILED') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => navigate('/')}
              className="text-primary-600 hover:text-primary-700 font-medium mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{scan.targetDomain}</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Scan Failed</h2>
            <p className="text-gray-600 mb-2">{scan.error || 'An unknown error occurred'}</p>
            <button
              onClick={() => navigate('/new-scan')}
              className="btn btn-primary mt-4"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 font-medium mb-2"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{scan.targetDomain}</h1>
              <p className="text-gray-600 mt-1">Scan Results</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Executive Summary */}
        <div className="mb-8">
          <ExecutiveSummary result={result} />
        </div>

        {/* Findings */}
        {findings.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Findings ({filteredFindings.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    filter === 'ALL'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All ({findings.length})
                </button>
                {summary.immediate > 0 && (
                  <button
                    onClick={() => setFilter(Priority.IMMEDIATE)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      filter === Priority.IMMEDIATE
                        ? 'bg-danger-600 text-white'
                        : 'bg-danger-100 text-danger-800 hover:bg-danger-200'
                    }`}
                  >
                    Critical ({summary.immediate})
                  </button>
                )}
                {summary.high > 0 && (
                  <button
                    onClick={() => setFilter(Priority.HIGH)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      filter === Priority.HIGH
                        ? 'bg-warning-600 text-white'
                        : 'bg-warning-100 text-warning-800 hover:bg-warning-200'
                    }`}
                  >
                    High ({summary.high})
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {filteredFindings.map((finding) => (
                <FindingCard key={finding.id} finding={finding} />
              ))}
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">All Clear!</h2>
            <p className="text-gray-600">
              No security issues found. Your domain appears secure.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
