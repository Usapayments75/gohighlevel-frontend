import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Ban as Bank } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's any redirect logic here that might be sending users to /payment/card
    // If so, update it to redirect to /payment/bank instead
  }, []);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <Link
            to="/payment/card"
            className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
              location.pathname === '/settings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Credit Card
            </div>
          </Link>
          <Link
            to="/payment/bank"
            className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
              location.pathname === '/payment/bank'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <Bank className="h-5 w-5 mr-2" />
              Bank Transfer
            </div>
          </Link>
        </nav>
      </div>
      <div className="p-4 sm:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Payment;