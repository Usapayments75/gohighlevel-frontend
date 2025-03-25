import React, { useState } from 'react';
import api from '../services/api';

const StatusPage = () => {
  const [txnId, setTxnId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkStatus = async () => {
    if (!txnId.trim()) {
      alert('Please enter a Transaction ID');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get(`/status/${txnId}`);
      setResult(res.data);
    } catch (err) {
      setError('Status fetch failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Transaction Status</h1>
      
      <div className="card">
        <h2>Check Transaction</h2>
        <div className="mt-4">
          <div className="form-group">
            <label>Transaction ID</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Enter Transaction ID" 
                value={txnId} 
                onChange={(e) => setTxnId(e.target.value)} 
                className="form-control"
              />
              <button 
                onClick={checkStatus} 
                className="btn btn-primary"
                style={{ whiteSpace: 'nowrap' }}
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </div>
          {error && (
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: 'rgba(220, 53, 69, 0.1)', 
              color: 'var(--danger-color)',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
      
      {result && (
        <div className="card mt-4">
          <h2>Transaction Details</h2>
          <div className="mt-4">
            <pre style={{ 
              backgroundColor: 'var(--light-color)', 
              padding: '15px', 
              borderRadius: '4px', 
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;