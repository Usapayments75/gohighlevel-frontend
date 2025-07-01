import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ApiResponse {
  status: string;
  message: string;
  data?: {
    locationId: string;
    companyId: string;
  };
  error?: string;
}

const API_BASE_URL = 'https://api-vendara.usapayments.com/api/v1';

export default function OAuthCallback() {
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [responseData, setResponseData] = useState<ApiResponse['data'] | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      // Extract code from URL query parameters
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (!code) {
        setStatus('error');
        setMessage('Authorization code is missing');
        return;
      }

      try {
        const response = await axios.post<ApiResponse>(
          `${API_BASE_URL}/ghl/sync-ghl-user`,
          { code },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === 'success') {
          setStatus('success');
          setMessage(response.data.message);
          setResponseData(response.data.data || null);
        } else {
          setStatus('error');
          setMessage(response.data.error || 'Unknown error occurred');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to sync user with GHL'
        );
      }
    };

    syncUser();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-indigo-600 animate-spin" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Connecting to CRM
            </h2>
            <p className="mt-3 text-gray-600">
              Please wait while we complete the integration...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Integration Successful!
            </h2>
            <p className="mt-3 text-gray-600">{message}</p>
            {responseData && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="text-sm font-medium text-gray-900">Integration Details:</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600">
                    Location ID: <span className="font-mono">{responseData.locationId}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Company ID: <span className="font-mono">{responseData.companyId}</span>
                  </p>
                </div>
              </div>
            )}
            <p className="mt-6 text-sm text-gray-500">
              You can now close this window and return to CRM
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Integration Failed
            </h2>
            <div className="mt-3 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{message}</p>
            </div>
            <div className="mt-6 space-y-4">
              <p className="text-gray-600">
                Please try again or contact support if the issue persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}