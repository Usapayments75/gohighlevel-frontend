import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LogOut, FileText } from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src="https://usapayments.com/wp-content/uploads/2023/03/28facc_76a02a73c8fc4d41b0a72805a254af78_mv2_d_2500_1500_s_2-1.png"
                  alt="USA Payments"
                  className="h-8 w-auto"
                />
              </div>
              <Link
                to="/documentation"
                className="ml-6 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FileText className="h-4 w-4 mr-2" />
                Documentation
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}