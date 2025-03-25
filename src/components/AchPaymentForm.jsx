import React, { useState } from 'react';
import api from '../services/api';

const AchPaymentForm = () => {
  const [formData, setFormData] = useState({
    routingNumber: '',
    accountNumber: '',
    nameOnAccount: '',
    amount: 100
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  
  // Generate a random device GUID (in a real app, this would be persistent)
  const deviceGuid = "86026025-5dcb-4875-a666-17b4b76a7f87";
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format routing number (numbers only)
    if (name === 'routingNumber') {
      const formattedValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    // Format account number (numbers only)
    if (name === 'accountNumber') {
      const formattedValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate routing number (9 digits)
    if (!formData.routingNumber || formData.routingNumber.length !== 9) {
      newErrors.routingNumber = 'Routing number must be 9 digits';
    }
    
    // Validate account number (between 4-17 digits)
    if (!formData.accountNumber || formData.accountNumber.length < 4 || formData.accountNumber.length > 17) {
      newErrors.accountNumber = 'Account number must be between 4-17 digits';
    }
    
    // Validate name on account
    if (!formData.nameOnAccount.trim()) {
      newErrors.nameOnAccount = 'Name on account is required';
    }
    
    // Validate amount
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous results
    setPaymentResult(null);
    setPaymentError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare payload
      const payload = {
        bankAccount: {
          routingNumber: formData.routingNumber,
          accountNumber: formData.accountNumber,
          nameOnAccount: formData.nameOnAccount
        },
        deviceGuid,
        amount: parseFloat(formData.amount),
        currency: "USD"
      };
      
      // Make API call
      const response = await api.post('/payment/ach', payload);
      setPaymentResult(response.data);
      
      // Reset form on success
      setFormData({
        routingNumber: '',
        accountNumber: '',
        nameOnAccount: '',
        amount: 100
      });
      
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="card mt-4">
      <h2>ACH Payment Details</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label>Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="100.00"
            className={`form-control ${errors.amount ? 'border-danger' : ''}`}
            style={{ maxWidth: '200px' }}
          />
          {errors.amount && (
            <div className="text-danger">{errors.amount}</div>
          )}
        </div>
        
        <div className="form-group">
          <label>Routing Number</label>
          <input
            type="text"
            name="routingNumber"
            value={formData.routingNumber}
            onChange={handleChange}
            placeholder="123456789"
            className={`form-control ${errors.routingNumber ? 'border-danger' : ''}`}
            maxLength="9"
          />
          {errors.routingNumber && (
            <div className="text-danger">{errors.routingNumber}</div>
          )}
          <small style={{ color: 'var(--secondary-color)', fontSize: '0.85rem' }}>
            The 9-digit number on the bottom left of your check
          </small>
        </div>
        
        <div className="form-group">
          <label>Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="12345678"
            className={`form-control ${errors.accountNumber ? 'border-danger' : ''}`}
            maxLength="17"
          />
          {errors.accountNumber && (
            <div className="text-danger">{errors.accountNumber}</div>
          )}
        </div>
        
        <div className="form-group">
          <label>Name on Account</label>
          <input
            type="text"
            name="nameOnAccount"
            value={formData.nameOnAccount}
            onChange={handleChange}
            placeholder="John Doe"
            className={`form-control ${errors.nameOnAccount ? 'border-danger' : ''}`}
          />
          {errors.nameOnAccount && (
            <div className="text-danger">{errors.nameOnAccount}</div>
          )}
        </div>
        
        <div className="form-group">
          <div style={{ 
            padding: '15px', 
            backgroundColor: 'rgba(23, 162, 184, 0.1)', 
            borderRadius: '4px',
            marginBottom: '15px',
            color: 'var(--info-color)',
            fontSize: '0.9rem'
          }}>
            <strong>Note:</strong> By submitting this form, you authorize us to debit your account for the amount specified above.
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Pay with ACH'}
        </button>
      </form>
      
      {paymentError && (
        <div 
          style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: 'rgba(220, 53, 69, 0.1)', 
            color: 'var(--danger-color)',
            borderRadius: '4px'
          }}
        >
          <strong>Error:</strong> {paymentError}
        </div>
      )}
      
      {paymentResult && (
        <div style={{ marginTop: '20px' }}>
          <div 
            style={{ 
              padding: '15px', 
              backgroundColor: 'rgba(40, 167, 69, 0.1)', 
              color: 'var(--success-color)',
              borderRadius: '4px',
              marginBottom: '15px',
              fontWeight: 'bold'
            }}
          >
            ACH payment processed successfully!
          </div>
          
          <div 
            style={{ 
              backgroundColor: 'var(--light-color)', 
              padding: '15px', 
              borderRadius: '4px', 
              overflow: 'auto',
              maxHeight: '300px'
            }}
          >
            <pre>{JSON.stringify(paymentResult, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchPaymentForm; 