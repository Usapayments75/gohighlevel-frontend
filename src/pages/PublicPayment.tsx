import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Invoice } from '../types/payment';
import PaymentHeader from '../components/payment/PaymentHeader';
import PaymentTabs from '../components/payment/PaymentTabs';
import CardPaymentForm from '../components/payment/CardPaymentForm';
import BankTransferForm from '../components/payment/BankTransferForm';

interface InvoiceResponse {
  status: string;
  data: {
    invoice: Invoice;
  };
}

export default function PublicPayment() {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'bank'>('card');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get<InvoiceResponse>(
          `https://api-vendara.usapayments.com/api/v1/ghl/my/invoice`
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

    if (!invoice) {
      fetchInvoice();
    }
  }, [invoice]);

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
          <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error || 'Invoice not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <PaymentHeader invoice={invoice} />
        <div className="bg-white shadow rounded-lg">
          <PaymentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cardPaymentSurcharge={invoice.cardPaymentSurcharge}
          />
          <div className="p-4 sm:p-6">
            {activeTab === 'card' ? (
              <CardPaymentForm invoice={invoice} navigate={navigate} />
            ) : (
              <BankTransferForm invoice={invoice} navigate={navigate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}