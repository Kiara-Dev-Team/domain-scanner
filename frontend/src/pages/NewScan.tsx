import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scanService } from '../services/api';

export const NewScan: React.FC = () => {
  const navigate = useNavigate();
  const [targetDomain, setTargetDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetDomain.trim()) {
      setError('Please enter a domain');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { scan } = await scanService.createScan(targetDomain);
      navigate(`/scan/${scan.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start scan');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Start New Scan</h1>
          <p className="text-gray-600 mt-1">Scan a domain for security vulnerabilities</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="domain" className="block text-sm font-medium text-gray-900 mb-2">
                Target Domain
              </label>
              <input
                type="text"
                id="domain"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="example.com or https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
              <p className="text-sm text-gray-600 mt-2">
                Enter the domain you want to scan (e.g., example.com or https://example.com)
              </p>
            </div>

            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-primary-900 mb-2">What to expect:</h3>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Scan typically takes 1-5 minutes depending on the target</li>
                <li>• We'll identify security vulnerabilities and misconfigurations</li>
                <li>• Results will be translated into business-friendly language</li>
                <li>• You'll receive actionable recommendations for each finding</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1"
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block mr-2">⏳</span>
                    Starting Scan...
                  </>
                ) : (
                  <>🔍 Start Scan</>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={loading}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Legal Notice */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-2">⚠️ Important Notice:</p>
          <p>
            Only scan domains you own or have explicit permission to scan. 
            Unauthorized scanning may violate laws and terms of service.
          </p>
        </div>
      </main>
    </div>
  );
};
