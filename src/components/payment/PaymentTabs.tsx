import React from 'react';
import { CreditCard, Ban as Bank } from 'lucide-react';

interface PaymentTabsProps {
  activeTab: 'card' | 'bank';
  setActiveTab: (tab: 'card' | 'bank') => void;
  cardPaymentSurcharge: number;
}

export default function PaymentTabs({ activeTab, setActiveTab, cardPaymentSurcharge }: PaymentTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex">
        <button
          onClick={() => setActiveTab('card')}
          className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
            activeTab === 'card'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Credit Card
            {cardPaymentSurcharge > 0 && (
              <span className="ml-1 text-xs text-gray-500">
                (+{cardPaymentSurcharge}% fee)
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
            activeTab === 'bank'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-center">
            <Bank className="h-5 w-5 mr-2" />
            Bank Transfer
          </div>
        </button>
      </nav>
    </div>
  );
}