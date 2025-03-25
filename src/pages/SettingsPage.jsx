import React, { useState } from 'react';

const SettingsPage = () => {
  const [dualPricing, setDualPricing] = useState(true);
  const [surcharge, setSurcharge] = useState(3.5);
  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = () => {
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div>
      <h1 className="page-title">App Settings</h1>
      
      <div className="card">
        <h2>Payment Settings</h2>
        <div className="mt-4">
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
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--secondary-color)', 
              marginTop: '5px',
              marginLeft: '25px'
            }}>
              When enabled, customers can choose to pay the surcharge or use ACH.
            </p>
          </div>
          
          {dualPricing && (
            <div className="form-group">
              <label>Surcharge Percentage (%)</label>
              <input 
                type="number" 
                value={surcharge} 
                onChange={(e) => setSurcharge(parseFloat(e.target.value))} 
                className="form-control"
                style={{ maxWidth: '100px' }}
              />
              <p style={{ 
                fontSize: '0.9rem', 
                color: 'var(--secondary-color)', 
                marginTop: '5px' 
              }}>
                This percentage will be added to card payments.
              </p>
            </div>
          )}
          
          <button onClick={handleSave} className="btn btn-primary">Save Settings</button>
          
          {saveStatus && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              backgroundColor: 'rgba(40, 167, 69, 0.1)', 
              color: 'var(--success-color)',
              borderRadius: '4px'
            }}>
              {saveStatus}
            </div>
          )}
        </div>
      </div>
      
      <div className="card mt-4">
        <h2>Account Information</h2>
        <div className="mt-4">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
            <div>
              <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '5px' }}>Email</p>
              <p style={{ fontWeight: 'bold' }}>user@example.com</p>
            </div>
            <div>
              <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '5px' }}>Account Type</p>
              <p style={{ fontWeight: 'bold' }}>Premium</p>
            </div>
            <div>
              <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '5px' }}>Member Since</p>
              <p style={{ fontWeight: 'bold' }}>January 15, 2023</p>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-secondary">Change Password</button>
            <button className="btn btn-danger" style={{ marginLeft: '10px' }}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;