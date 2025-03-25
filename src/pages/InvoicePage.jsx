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

  // Sample invoices for the table
  const invoices = [
    { id: 'INV-001', date: '2023-10-15', amount: 250.00, status: 'Paid' },
    { id: 'INV-002', date: '2023-09-30', amount: 175.50, status: 'Paid' },
    { id: 'INV-003', date: '2023-09-15', amount: 320.75, status: 'Pending' },
    { id: 'INV-004', date: '2023-08-30', amount: 150.00, status: 'Overdue' }
  ];

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
              </div>
              
              {dualPricing && (
                <div className="form-group">
                  <label>Surcharge Percentage (%)</label>
                  <input 
                    type="number" 
                    value={surchargePercent} 
                    onChange={(e) => setSurchargePercent(parseFloat(e.target.value))} 
                    className="form-control"
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
            </div>
            
            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ 
                backgroundColor: 'var(--light-color)', 
                padding: '20px', 
                borderRadius: '8px',
                height: '100%'
              }}>
                <h3 style={{ marginBottom: '15px' }}>Invoice Preview</h3>
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>Amount</p>
                  <p style={{ fontWeight: 'bold' }}>${amount.toFixed(2)}</p>
                </div>
                {dualPricing && (
                  <div style={{ marginBottom: '10px' }}>
                    <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>With Surcharge</p>
                    <p style={{ fontWeight: 'bold' }}>${(amount * (1 + surchargePercent/100)).toFixed(2)}</p>
                  </div>
                )}
                <div>
                  <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>Date</p>
                  <p style={{ fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {result && (
        <div className="card mt-4">
          <h2>Invoice Result</h2>
          <div className="mt-4">
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
      
      <div className="card mt-4">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <h2>Recent Invoices</h2>
          <div>
            <button className="btn btn-secondary" style={{ marginRight: '10px' }}>Export</button>
            <button className="btn btn-primary">+ New Invoice</button>
          </div>
        </div>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.date}</td>
                  <td>${invoice.amount.toFixed(2)}</td>
                  <td>
                    <span style={{ 
                      padding: '5px 10px', 
                      borderRadius: '4px', 
                      fontSize: '0.9rem',
                      backgroundColor: 
                        invoice.status === 'Paid' ? 'rgba(40, 167, 69, 0.1)' : 
                        invoice.status === 'Pending' ? 'rgba(255, 193, 7, 0.1)' : 
                        'rgba(220, 53, 69, 0.1)',
                      color: 
                        invoice.status === 'Paid' ? 'var(--success-color)' : 
                        invoice.status === 'Pending' ? 'var(--warning-color)' : 
                        'var(--danger-color)',
                      display: 'inline-block'
                    }}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>View</button>
                    <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.9rem', marginLeft: '5px' }}>Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card mt-4">
        <h2>Invoice Summary</h2>
        <div className="flex-row mt-4">
          <div style={{ 
            flex: '1 1 200px', 
            padding: '15px', 
            backgroundColor: 'rgba(74, 108, 247, 0.1)', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Total Paid</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>$425.50</p>
          </div>
          
          <div style={{ 
            flex: '1 1 200px', 
            padding: '15px', 
            backgroundColor: 'rgba(255, 193, 7, 0.1)', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Pending</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--warning-color)' }}>$320.75</p>
          </div>
          
          <div style={{ 
            flex: '1 1 200px', 
            padding: '15px', 
            backgroundColor: 'rgba(220, 53, 69, 0.1)', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Overdue</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--danger-color)' }}>$150.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;