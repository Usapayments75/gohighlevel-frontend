import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Download, Share2 } from 'lucide-react';

export default function ThankYou() {
  const location = useLocation();
  const paymentDetails = location.state?.paymentDetails;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {paymentDetails && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                <div className="mt-2 bg-gray-50 rounded-md p-4">
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                      <dd className="text-sm text-gray-900">{paymentDetails.guid}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Amount</dt>
                      <dd className="text-sm text-gray-900">${paymentDetails.amount.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm font-medium text-green-600">{paymentDetails.status}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Date</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(paymentDetails.timeStamp).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    // Handle receipt download
                    window.print();
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </button>
                <button
                  onClick={() => {
                    // Handle share functionality
                    if (navigator.share) {
                      navigator.share({
                        title: 'Payment Receipt',
                        text: `Payment of $${paymentDetails.amount.toFixed(2)} completed successfully.`,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Receipt
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}