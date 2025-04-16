import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import Status from './pages/Status';
import Payment from './pages/Payment';
import BankTransfer from './pages/BankTransfer';
import Invoice from './pages/Invoice';
import Documentation from './pages/Documentation';
import DashboardLayout from './components/DashboardLayout';
import OAuthCallback from './pages/OAuthCallback';
import PublicPayment from './pages/PublicPayment';
import ThankYou from './pages/ThankYou';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-center" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/thank-you" element={<ThankYou />} />
          
          {/* Public Payment Route */}
          <Route path="/pay" element={<PublicPayment />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="payment" element={<Payment />}>
              <Route path="bank" element={<BankTransfer />} />
              <Route index element={<Navigate to="bank" replace />} />
            </Route>
            <Route path="status" element={<Status />} />
            <Route path="invoice" element={<Invoice />} />
            <Route path="settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            <Route index element={<Navigate to="/settings" replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;