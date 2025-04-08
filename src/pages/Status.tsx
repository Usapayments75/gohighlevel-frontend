import React, { useState } from 'react';
import { Search, CreditCard, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { statusApi } from '../services/api';

interface TransactionDetails {
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  timestamp: string;
  details: {
    paymentMethod: string;
    last4: string;
    cardType: string;
  };
}

export default function Status() {
  const [transactionId, setTransactionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error('Please enter a transaction ID');
      return;
    }

    setIsLoading(true);
    try {
      const response = await statusApi.checkStatus(transactionId);
      setTransaction(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch transaction status');
      setTransaction(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Transaction Status
        </h3>
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="flex gap-4">
            <div className="flex-grow">
              <label htmlFor="transactionId" className="sr-only">
                Transaction ID
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="transactionId"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Checking...' : 'Check Status'}
            </button>
          </div>
        </form>

        {transaction && (
          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-gray-500">Transaction ID</div>
                  <div className="mt-1 text-sm text-gray-900">{transaction.transactionId}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Amount</div>
                  <div className="mt-1 text-sm text-gray-900 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Payment Method</div>
                  <div className="mt-1 text-sm text-gray-900 flex items-center">
                    <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                    {transaction.details.cardType} **** {transaction.details.last4}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm font-medium text-gray-500">Timestamp</div>
                  <div className="mt-1 text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {formatDate(transaction.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}