import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CreditCard, Ban as Bank, Calendar, User, Lock, Hash, Building as BankIcon } from 'lucide-react';
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
  var url =  document.URL;
  var location = document.location;
  var ancestorOrigins = document.location.ancestorOrigins;
  const isIframe = window.self !== window.top;
  const urlNew = isIframe ? document.referrer : document.location.href;
  
  if (loading) {
    return (
      <div>
        {url}<br/>{JSON.stringify(location)}<br/>{JSON.stringify(ancestorOrigins)}<br/>{urlNew}<br/>{isIframe}
      </div>
      // <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      //   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      // </div>
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await axios.post('https://api-vendara.usapayments.com/api/v1/payment/card', {
        amount: parseFloat(invoice.totalWithSurcharge),
        currency: invoice.currency,
        invoiceId: invoice.invoiceId,
        card: {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          cardHolderName: formData.cardHolderName,
          expirationDate: formData.expirationDate,
          cvv: formData.cvv,
        },
      });

      toast.success('Payment processed successfully!');
      // Reset form
      setFormData({
        cardNumber: '',
        cardHolderName: '',
        expirationDate: '',
        cvv: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const year = cleaned.slice(0, 2);
    const month = cleaned.slice(2, 4);
    
    if (cleaned.length >= 4) {
      return `${year}${month}`;
    }
    return cleaned;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount (with {invoice.cardPaymentSurcharge}% surcharge)
        </label>
        <div className="mt-1">
          <input
            type="text"
            value={`$${invoice.totalWithSurcharge}`}
            disabled
            className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
          Card Number
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="cardNumber"
            required
            maxLength={19}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700">
          Cardholder Name
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="cardHolderName"
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="John Doe"
            value={formData.cardHolderName}
            onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
            Expiration Date (YYMM)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="expirationDate"
              required
              maxLength={4}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="YYMM"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: formatExpirationDate(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
            CVV
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="cvv"
              required
              maxLength={4}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="123"
              value={formData.cvv}
              onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}

function BankTransferForm({ invoice }: { invoice: Invoice }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking',
    accountHolderName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await axios.post('https://api-vendara.usapayments.com/api/v1/payment/ach', {
        amount: parseFloat(invoice.amountDue),
        currency: invoice.currency,
        invoiceId: invoice.invoiceId,
        bankAccount: {
          routingNumber: formData.routingNumber,
          accountNumber: formData.accountNumber,
          accountType: formData.accountType,
          nameOnAccount: formData.accountHolderName,
        },
      });

      toast.success('Bank transfer initiated successfully!');
      // Reset form
      setFormData({
        routingNumber: '',
        accountNumber: '',
        accountType: 'checking',
        accountHolderName: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Bank transfer failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="mt-1">
          <input
            type="text"
            value={`$${invoice.amountDue}`}
            disabled
            className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700">
          Routing Number
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BankIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="routingNumber"
            required
            maxLength={9}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="123456789"
            value={formData.routingNumber}
            onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">The 9-digit number on the bottom left of your check</p>
      </div>

      <div>
        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
          Account Number
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Hash className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="accountNumber"
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Your account number"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
          Account Type
        </label>
        <div className="mt-1">
          <select
            id="accountType"
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.accountType}
            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
          Account Holder Name
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="accountHolderName"
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="John Doe"
            value={formData.accountHolderName}
            onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-blue-50 rounded-md p-4">
        <p className="text-sm text-blue-700">
          By submitting this form, you authorize us to debit your account for the amount specified above.
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Pay with Bank Transfer'}
        </button>
      </div>
    </form>
  );
}