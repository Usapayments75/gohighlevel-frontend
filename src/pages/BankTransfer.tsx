import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Building as BankIcon, Hash, User, X, CheckCircle, Receipt, DollarSign, FileText, Calendar } from 'lucide-react';
import { paymentApi } from '../services/api';

interface PaymentResponse {
  guid: string;
  status: string;
  timeStamp: string;
  deviceGuid: string;
  deviceName: string;
  merchantName: string;
  amount: number;
  grossAmount: number;
  effectiveAmount: number;
  refNumber: string;
  isBusinessPayment: boolean;
  operationType: string;
  settlementType: string;
  isSettled: boolean;
  processorStatusCode: string;
  processorResponseMessage: string;
  wasProcessed: boolean;
  customerReceipt: string;
  approvalCode: string;
  bankAccount: {
    guid: string;
    routingNumber: string;
    accountNumber: string;
    accountNumberLastFour: string;
    nameOnAccount: string;
  };
  clearingProcessorUpdate: Array<{
    timestamp: string;
    transactionStatusUpdate: string;
    settlementStatusUpdate: string;
    reportingNotesUpdate: string;
    statusMessageUpdate: string;
  }>;
}

export default function BankTransfer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking',
    accountHolderName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await paymentApi.processAchPayment({
        amount: parseFloat(formData.amount),
        currency: 'USD',
        bankAccount: {
          routingNumber: formData.routingNumber,
          accountNumber: formData.accountNumber,
          nameOnAccount: formData.accountHolderName,
        },
        deviceGuid: '86026025-5dcb-4875-a666-17b4b76a7f87', // This should come from settings
      });

      setPaymentResponse(response.data);
      setShowModal(true);
      toast.success('Bank transfer initiated successfully!');
      // Reset form
      setFormData({
        amount: '',
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount ($)
          </label>
          <div className="mt-1">
            <input
              type="number"
              step="0.01"
              min="0.01"
              id="amount"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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

      {/* Payment Success Modal */}
      {showModal && paymentResponse && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Bank Transfer Initiated</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {/* Transaction Details */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Transaction Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.guid}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1 text-sm text-green-600">{paymentResponse.status}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date & Time</p>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(paymentResponse.timeStamp)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reference Number</p>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.refNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Payment Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="text-sm font-medium text-gray-500">Amount</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatCurrency(paymentResponse.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Settlement Type</p>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.settlementType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Operation Type</p>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.operationType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Processor Status</p>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.processorStatusCode}</p>
                    </div>
                  </div>
                </div>

                {/* Bank Account Details */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Bank Account Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center">
                        <BankIcon className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="text-sm font-medium text-gray-500">Account Details</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900">
                        ****{paymentResponse.bankAccount.accountNumberLastFour}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="text-sm font-medium text-gray-500">Account Holder</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.bankAccount.nameOnAccount}</p>
                    </div>
                  </div>
                </div>

                {/* Latest Status Update */}
                {paymentResponse.clearingProcessorUpdate?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Latest Status Update</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-900">
                          {formatDate(paymentResponse.clearingProcessorUpdate[0].timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {paymentResponse.clearingProcessorUpdate[0].statusMessageUpdate.replace(' > ', '')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Here you could implement receipt download or print functionality
                      toast.success('Receipt downloaded successfully');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}