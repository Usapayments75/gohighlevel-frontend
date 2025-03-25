import React, { useState } from 'react';
import CardPaymentForm from '../components/CardPaymentForm';
import AchPaymentForm from '../components/AchPaymentForm';

const PaymentPage = () => {
  const [method, setMethod] = useState('card');

  return (
    <div>
      <h1 className="page-title">Make a Payment</h1>
      
      <div className="card">
        <h2>Payment Method</h2>
        <div className="mt-4">
          <div className="form-group">
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <div 
                onClick={() => setMethod('card')} 
                style={{ 
                  padding: '15px', 
                  border: `2px solid ${method === 'card' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: method === 'card' ? 'rgba(74, 108, 247, 0.05)' : 'transparent',
                  flex: '1',
                  maxWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '25px', 
                  backgroundColor: '#1a1f71', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>CARD</div>
                <span>Credit Card</span>
              </div>
              
              <div 
                onClick={() => setMethod('ach')} 
                style={{ 
                  padding: '15px', 
                  border: `2px solid ${method === 'ach' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: method === 'ach' ? 'rgba(74, 108, 247, 0.05)' : 'transparent',
                  flex: '1',
                  maxWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '25px', 
                  backgroundColor: '#28a745', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>ACH</div>
                <span>Bank Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {method === 'card' ? (
        <CardPaymentForm />
      ) : (
        <AchPaymentForm />
      )}
      
      <div className="card mt-4">
        <h2>Saved Payment Methods</h2>
        <div className="mt-4">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '15px',
            padding: '15px',
            border: '1px solid var(--border-color)',
            borderRadius: '8px'
          }}>
            <div style={{ 
              width: '50px', 
              height: '30px', 
              backgroundColor: '#1a1f71', 
              borderRadius: '4px', 
              marginRight: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>VISA</div>
            <div style={{ flex: '1' }}>
              <p>Visa ending in 4242</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>Expires 12/25</p>
            </div>
            <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>Use</button>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: '15px',
            border: '1px solid var(--border-color)',
            borderRadius: '8px'
          }}>
            <div style={{ 
              width: '50px', 
              height: '30px', 
              backgroundColor: '#ff5f00', 
              borderRadius: '4px', 
              marginRight: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>MC</div>
            <div style={{ flex: '1' }}>
              <p>Mastercard ending in 5555</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>Expires 10/24</p>
            </div>
            <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>Use</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;