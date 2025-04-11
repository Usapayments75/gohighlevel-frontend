import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { CreditCard, Calendar, User, Lock } from 'lucide-react';
import { Invoice } from '../../types/payment';
import { paymentApi } from '../../services/api';

interface CardPaymentFormProps {
  invoice: Invoice;
  navigate: (path: string, options?: any) => void;
}

export default function CardPaymentForm({ invoice, navigate }: CardPaymentFormProps) {
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
      const response = await paymentApi.processCardPayment({
        amount: parseFloat(invoice.totalWithSurcharge),
        currency: invoice.currency,
        card: {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          cardHolderName: formData.cardHolderName,
          expirationDate: formData.expirationDate,
          cvv: formData.cvv,
        },
        deviceGuid: 'b28c858c-cdb5-44be-949d-3edbb38069af', // This should come from settings
      });

      navigate('/thank-you', { state: { paymentDetails: response.data } });
      toast.success('Payment processed successfully!');
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