import React from 'react';
import { Invoice } from '../../types/payment';

interface PaymentHeaderProps {
  invoice: Invoice;
}

export default function PaymentHeader({ invoice }: PaymentHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{invoice.businessName}</h1>
      <p className="mt-2 text-lg text-gray-600">Invoice Payment</p>
      <div className="mt-4 bg-white rounded-lg shadow px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Invoice Number</p>
            <p className="mt-1 text-sm text-gray-900">{invoice.invoiceId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Amount Due</p>
            <p className="mt-1 text-sm text-gray-900">${invoice.amountDue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}