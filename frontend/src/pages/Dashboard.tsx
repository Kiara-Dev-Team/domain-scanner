import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scanService } from '../services/api';
import { Scan } from '../types';
import { formatDistanceToNow } from 'date-fns';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      setLoading(true);
      const data = await scanService.getAllScans();
      setScans(data.scans);
    } catch (err) {
      setError('Failed to load scans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      PENDING: { color: 'bg-gray-100 text-gray-800', label: 'Pending' },
      RUNNING: { color: 'bg-primary-100 text-primary-800', label: 'Running...' },
      COMPLETED: { color: 'bg-success-100 text-success-800', label: 'Completed' },
      FAILED: { color: 'bg-danger-100 text-danger-800', label: 'Failed' },
    };
    const style = config[status as keyof typeof config] || config.PENDING;
    return (
      <span className={`badge ${style.color}`}>
        {style.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Domain Scanner</h1>
              <p className="text-gray-600 mt-1">Security scanning made simple for business leaders</p>
            </div>
            <button
              onClick={() => navigate('/new-scan')}
              className="btn btn-primary"
            >
              ➕ Start New Scan
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {scans.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Scans Yet</h2>
            <p className="text-gray-600 mb-6">
              Start your first security scan to understand your risk profile
            </p>
            <button
              onClick={() => navigate('/new-scan')}
              className="btn btn-primary"
            >
              Start New Scan
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Scans</h2>
            <div className="space-y-4">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => scan.status === 'COMPLETED' && navigate(`/scan/${scan.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {scan.targetDomain}
                        </h3>
                        {getStatusBadge(scan.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          Created {formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}
                        </span>
                        {scan.findingsCount !== undefined && (
                          <span>
                            {scan.findingsCount} finding{scan.findingsCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      {scan.error && (
                        <p className="text-danger-600 text-sm mt-2">Error: {scan.error}</p>
                      )}
                    </div>
                    {scan.status === 'COMPLETED' && (
                      <div className="text-primary-600 font-medium">
                        View Results →
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
