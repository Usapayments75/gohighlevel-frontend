import React from 'react';
import { CreditCard, Building2, FileText, Search, DollarSign, Shield, Zap } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              USA Payments Documentation
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-indigo-200">
              Complete guide to using the USA Payments portal for processing payments and managing transactions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Getting Started */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-indigo-500" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Getting Started</h2>
            </div>
            <div className="mt-4 space-y-4">
              <p className="text-gray-600">
                To begin using the portal:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  <a 
                    href="https://payments.usapayments.com/register" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500 underline"
                  >
                    Create an account
                  </a> or sign in
                </li>
                <li>Configure your merchant settings</li>
                <li>Set up payment methods</li>
                <li>Start accepting payments</li>
              </ol>
            </div>
          </div>

          {/* Card Payments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-indigo-500" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Card Payments</h2>
            </div>
            <div className="mt-4 space-y-4">
              <p className="text-gray-600">
                Process credit card payments securely:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Enter payment amount</li>
                <li>Input card details</li>
                <li>Verify cardholder information</li>
                <li>Submit for processing</li>
                <li>View transaction receipt</li>
              </ul>
            </div>
          </div>

          {/* Bank Transfers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-indigo-500" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Bank Transfers</h2>
            </div>
            <div className="mt-4 space-y-4">
              <p className="text-gray-600">
                Process ACH payments:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Enter transfer amount</li>
                <li>Provide routing number</li>
                <li>Input account details</li>
                <li>Confirm account holder info</li>
                <li>Authorize transfer</li>
              </ul>
            </div>
          </div>

          {/* Invoicing */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-indigo-500" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Invoicing</h2>
            </div>
            <div className="mt-4 space-y-4">
              <p className="text-gray-600">
                Create and manage invoices:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Set base amount</li>
                <li>Enable dual pricing</li>
                <li>Configure surcharge rates</li>
                <li>Calculate final amounts</li>
                <li>Send to customers</li>
              </ul>
            </div>
          </div>

          {/* Transaction Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-indigo-500" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Transaction Status</h2>
            </div>
            <div className="mt-4 space-y-4">
              <p className="text-gray-600">
                Track payment status:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Enter transaction ID</li>
                <li>View payment details</li>
                <li>Check processing status</li>
                <li>Download receipts</li>
                <li>Monitor settlements</li>
              </ul>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-500" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Security</h2>
            </div>
            <div className="mt-4 space-y-4">
              <p className="text-gray-600">
                Payment security features:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>PCI DSS compliance</li>
                <li>Encrypted transactions</li>
                <li>Fraud prevention</li>
                <li>Secure authentication</li>
                <li>Data protection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Pricing Structure</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <DollarSign className="h-6 w-6 text-indigo-500" />
                  <h3 className="ml-2 text-lg font-semibold text-gray-900">Card Payments</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-32">Credit Cards:</span>
                    <span className="font-semibold">2.9% + $0.30</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-32">Debit Cards:</span>
                    <span className="font-semibold">1.9% + $0.30</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-32">International:</span>
                    <span className="font-semibold">3.9% + $0.30</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <Building2 className="h-6 w-6 text-indigo-500" />
                  <h3 className="ml-2 text-lg font-semibold text-gray-900">Bank Transfers</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-32">ACH Debit:</span>
                    <span className="font-semibold">1.0% (max $10)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-32">ACH Credit:</span>
                    <span className="font-semibold">Free</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-32">Wire Transfer:</span>
                    <span className="font-semibold">$25 per transfer</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-8">
            Our support team is available 24/7 to assist you with any questions or concerns.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:support@usapayments.com"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Contact Support
            </a>
            <a
              href="tel:+18005551234"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}