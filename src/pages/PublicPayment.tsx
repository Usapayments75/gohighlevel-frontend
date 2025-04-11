import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CreditCard, Ban as Bank } from 'lucide-react';
import axios from 'axios';

interface Invoice {
  id: number;
  invoiceId: string;
  name: string;
  businessName: string;
  currency: string;
  total: string;
  amountDue: string;
  status: string;
  cardPaymentSurcharge: number;
  surchargeAmount: string;
  totalWithSurcharge: string;
}

interface InvoiceResponse {
  status: string;
  data: {
    invoice: Invoice;
  };
}

export default function PublicPayment() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'bank'>('card');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get<InvoiceResponse>(
          `https://api-vendara.usapayments.com/api/ghl/public/invoice/${invoiceId}`
        );
        setInvoice(response.data.data.invoice);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to fetch invoice details';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Invoice not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{invoice.businessName}</h1>
          <p className="mt-2 text-lg text-gray-600">Invoice Payment</p>
        </div>

        <div className="bg-white shadow rounded-lg">
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
                  {invoice.cardPaymentSurcharge > 0 && (
                    <span className="ml-1 text-xs text-gray-500">
                      (+{invoice.cardPaymentSurcharge}% fee)
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
          <div className="p-4 sm:p-6">
            {activeTab === 'card' ? (
              <CardPaymentForm invoice={invoice} />
            ) : (
              <BankTransferForm invoice={invoice} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CardPaymentForm({ invoice }: { invoice: Invoice }) {
  // Your existing CardPayment component code, but with:
  // - amount field disabled and prefilled with invoice.totalWithSurcharge
  // - deviceGuid from settings
  return <div>Card Payment Form (amount: {invoice.totalWithSurcharge})</div>;
}

function BankTransferForm({ invoice }: { invoice: Invoice }) {
  // Your existing BankTransfer component code, but with:
  // - amount field disabled and prefilled with invoice.amountDue
  // - deviceGuid from settings
  return <div>Bank Transfer Form (amount: {invoice.amountDue})</div>;
}