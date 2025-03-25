import React, { useState } from 'react';
import api from '../services/api';

const InvoicePage = () => {
  const [amount, setAmount] = useState(100);
  const [dualPricing, setDualPricing] = useState(true);
  const [surchargePercent, setSurchargePercent] = useState(3.5);
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const createInvoice = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const res = await api.post('/invoice/create', {
        amount,
        dualPricing,
        surchargePercent
      });
      setResult(res.data);
    } catch (err) {
      setError('Error creating invoice. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Invoices</h1>
      
      <div className="card">
        <h2>Create New Invoice</h2>
        <div className="mt-4">
          <div className="flex-row">
            <div style={{ flex: '1', minWidth: '250px' }}>
              <div className="form-group">
                <label>Amount ($)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(parseFloat(e.target.value))} 
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={dualPricing} 
                    onChange={() => setDualPricing(!dualPricing)} 
                    style={{ marginRight: '10px' }}
                  />
                  Enable Dual Pricing
                </label>
                <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', marginTop: '5px' }}>
                  When enabled, customers can choose to pay the surcharge or use ACH.
                </p>
              </div>
              
              {dualPricing && (
                <div className="form-group">
                  <label>Surcharge Percentage (%)</label>
                  <input 
                    type="number" 
                    value={surchargePercent} 
                    onChange={(e) => setSurchargePercent(parseFloat(e.target.value))} 
                    className="form-control"
                    style={{ maxWidth: '100px' }}
                  />
                </div>
              )}
              
              <button 
                onClick={createInvoice} 
                className="btn btn-primary"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Invoice'}
              </button>
              
              {error && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '10px', 
                  backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                  color: 'var(--danger-color)',
                  borderRadius: '4px'
                }}>
                  {error}
                </div>
              )}
            </div>
            
            {result && (
              <div style={{ flex: '1', minWidth: '250px' }}>
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: 'rgba(40, 167, 69, 0.1)', 
                  borderRadius: '4px',
                  marginBottom: '15px',
                  color: 'var(--success-color)',
                  fontWeight: 'bold'
                }}>
                  Invoice generated successfully!
                </div>
                <div>
                  <p><strong>Invoice ID:</strong> {result.invoiceId}</p>
                  <p><strong>Amount:</strong> ${result.amount.toFixed(2)}</p>
                  <p><strong>Payment Link:</strong> <a href={result.paymentLink} target="_blank" rel="noopener noreferrer">{result.paymentLink}</a></p>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <button className="btn btn-secondary">Copy Link</button>
                  <button className="btn btn-primary" style={{ marginLeft: '10px' }}>Send Invoice</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;