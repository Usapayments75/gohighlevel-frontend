import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import StatusPage from './pages/StatusPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import InvoicePage from './pages/InvoicePage.jsx';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="container navbar-container">
            <NavLink to="/" className="navbar-logo">
              <img 
                src="https://usapayments.com/wp-content/uploads/2023/03/28facc_76a02a73c8fc4d41b0a72805a254af78_mv2_d_2500_1500_s_2-1.png" 
                alt="USA Payments" 
                style={{ 
                  height: '40px', 
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
              />
            </NavLink>
            <button className="mobile-menu-toggle" onClick={toggleMenu}>
              {menuOpen ? '✕' : '☰'}
            </button>
            <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
              <li className="navbar-item">
                <NavLink to="/" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"} onClick={() => setMenuOpen(false)}>
                  Status
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink to="/settings" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"} onClick={() => setMenuOpen(false)}>
                  Settings
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink to="/payment" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"} onClick={() => setMenuOpen(false)}>
                  Payment
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink to="/invoice" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"} onClick={() => setMenuOpen(false)}>
                  Invoice
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="container">
          <Routes>
            <Route path="/" element={<StatusPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/invoice" element={<InvoicePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;