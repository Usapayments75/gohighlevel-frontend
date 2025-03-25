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
      <h1 className="page-title">Settings</h1>
      
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
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', marginTop: '5px' }}>
              When enabled, customers will have the option to pay the processing fee.
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
            </div>
          )}
          
          <div className="form-group">
            <button onClick={handleSave} className="btn btn-primary">Save Settings</button>
            {saveStatus && (
              <div style={{ 
                marginTop: '10px', 
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
      </div>
      
      <div className="card mt-4">
        <h2>Notification Preferences</h2>
        <div className="mt-4">
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                defaultChecked={true} 
                style={{ marginRight: '10px' }}
              />
              Email Notifications
            </label>
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', marginTop: '5px' }}>
              Receive email notifications for payment events.
            </p>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                defaultChecked={true} 
                style={{ marginRight: '10px' }}
              />
              SMS Notifications
            </label>
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', marginTop: '5px' }}>
              Receive text message notifications for payment events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;