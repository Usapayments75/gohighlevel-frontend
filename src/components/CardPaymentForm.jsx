import React, { useState } from 'react';
import api from '../services/api';

const CardPaymentForm = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
    amount: 100
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  
  // Generate a random device GUID (in a real app, this would be persistent)
  const deviceGuid = "b28c858c-cdb5-44be-949d-3edbb38069af";
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    // Format expiration date (YY/MM format)
    if (name === 'expirationDate') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}${cleaned.slice(2, 4)}`;
      }
      
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate card number (simple validation, just checking if it's 16-19 digits)
    const cardNumberDigits = formData.cardNumber.replace(/\D/g, '');
    if (!cardNumberDigits || cardNumberDigits.length < 16 || cardNumberDigits.length > 19) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    // Validate cardholder name
    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Cardholder name is required';
    }
    
    // Validate expiration date
    if (!formData.expirationDate || formData.expirationDate.length !== 4) {
      newErrors.expirationDate = 'Please enter a valid expiration date (YYMM)';
    } else {
      const year = parseInt(formData.expirationDate.substring(0, 2), 10);
      const month = parseInt(formData.expirationDate.substring(2, 4), 10);
      
      if (month < 1 || month > 12) {
        newErrors.expirationDate = 'Please enter a valid month (01-12)';
      }
      
      // Check if the card is not expired
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of year
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expirationDate = 'Card has expired';
      }
    }
    
    // Validate CVV (3-4 digits)
    if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
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
        amount: parseFloat(formData.amount),
        card: {
          cardNumber: formData.cardNumber.replace(/\D/g, ''),
          cardHolderName: formData.cardHolderName,
          expirationDate: formData.expirationDate,
          cvv: formData.cvv
        },
        deviceGuid,
        currency: "USD"
      };
      
      // Make API call
      const response = await api.post('/payment/card', payload);
      setPaymentResult(response.data);
      
      // Reset form on success
      setFormData({
        cardNumber: '',
        cardHolderName: '',
        expirationDate: '',
        cvv: '',
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
      <h2>Card Payment Details</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="4111 1111 1111 1111"
            className={`form-control ${errors.cardNumber ? 'border-danger' : ''}`}
            autoComplete="cc-number"
          />
          {errors.cardNumber && (
            <div className="text-danger">{errors.cardNumber}</div>
          )}
        </div>
        
        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            name="cardHolderName"
            value={formData.cardHolderName}
            onChange={handleChange}
            placeholder="John Doe"
            className={`form-control ${errors.cardHolderName ? 'border-danger' : ''}`}
            autoComplete="cc-name"
          />
          {errors.cardHolderName && (
            <div className="text-danger">{errors.cardHolderName}</div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Expiry Date (YY/MM)</label>
            <input
              type="text"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              placeholder="YYMM"
              className={`form-control ${errors.expirationDate ? 'border-danger' : ''}`}
              maxLength="4"
              autoComplete="cc-exp"
            />
            {errors.expirationDate && (
              <div className="text-danger">{errors.expirationDate}</div>
            )}
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label>CVV</label>
            <input
              type="password"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              className={`form-control ${errors.cvv ? 'border-danger' : ''}`}
              maxLength="4"
              autoComplete="cc-csc"
            />
            {errors.cvv && (
              <div className="text-danger">{errors.cvv}</div>
            )}
          </div>
        </div>
        
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
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Pay Now'}
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
            Payment processed successfully!
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

export default CardPaymentForm; 