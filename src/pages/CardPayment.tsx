import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { CreditCard, Calendar, User, Lock, X, CheckCircle, Receipt, DollarSign, Building2, FileText } from 'lucide-react';
import { paymentApi } from '../services/api';

interface PaymentResponse {
  guid: string;
  status: string;
  batchStatus: string;
  timeStamp: string;
  amount: number;
  currency: string;
  cardDataSource: string;
  processorStatusCode: string;
  processorResponseMessage: string;
  authCode: string;
  refNumber: string;
  customerReceipt: string;
  card: {
    first6: string;
    last4: string;
    cardType: string;
    cardHolderName: string;
  };
  addressVerificationResult: string;
  meta?: {
    originalAmount: number;
    finalAmount: number;
    surchargeApplied: boolean;
    surchargeRate: number;
  };
}

export default function CardPayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await paymentApi.processCardPayment({
        amount: parseFloat(formData.amount),
        currency: 'USD',
        card: {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          cardHolderName: formData.cardHolderName,
          expirationDate: formData.expirationDate,
          cvv: formData.cvv,
        },
        deviceGuid: 'b28c858c-cdb5-44be-949d-3edbb38069af', // This should come from settings
      });

      setPaymentResponse(response.data);
      setShowModal(true);
      toast.success('Payment processed successfully!');
      // Reset form
      setFormData({
        amount: '',
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

      {/* Payment Success Modal */}
      {showModal && paymentResponse && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Payment Successful</h3>
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
                      <p className="text-sm font-medium text-gray-500">Batch Status</p>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.batchStatus}</p>
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
                        {formatCurrency(paymentResponse.amount, paymentResponse.currency)}
                      </p>
                    </div>
                    {paymentResponse?.meta?.surchargeApplied && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Surcharge</p>
                        <p className="mt-1 text-sm text-gray-900">{paymentResponse.meta.surchargeRate}%</p>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="text-sm font-medium text-gray-500">Processor Response</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.processorResponseMessage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Authorization</p>
                      <p className="mt-1 text-sm text-gray-900">
                        Auth: {paymentResponse.authCode} | Ref: {paymentResponse.refNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Card Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="text-sm font-medium text-gray-500">Card Details</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900">
                        {paymentResponse.card.cardType} ({paymentResponse.card.first6}******{paymentResponse.card.last4})
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="text-sm font-medium text-gray-500">Cardholder</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.card.cardHolderName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Card Source</p>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.cardDataSource}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address Verification</p>
                      <p className="mt-1 text-sm text-gray-900">{paymentResponse.addressVerificationResult}</p>
                    </div>
                  </div>
                </div>

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