import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Building as BankIcon, Hash, User } from 'lucide-react';
import { Invoice } from '../../types/payment';
import { paymentApi } from '../../services/api';

interface BankTransferFormProps {
  invoice: Invoice;
  navigate: (path: string, options?: any) => void;
}

export default function BankTransferForm({ invoice, navigate }: BankTransferFormProps) {
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
      const response = await paymentApi.processAchPayment({
        amount: parseFloat(invoice.amountDue),
        currency: invoice.currency,
        invoiceId: invoice.invoiceId,
        bankAccount: {
          routingNumber: formData.routingNumber,
          accountNumber: formData.accountNumber,
          nameOnAccount: formData.accountHolderName,
        },
        deviceGuid: '412aeec3-05ae-421e-8163-7939eb5cea37', // This should come from settings
      });

      navigate('/thank-you', { state: { paymentDetails: response.data } });
      toast.success('Bank transfer initiated successfully!');
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
      <input type="hidden" name="invoiceId" value={invoice.invoiceId} />
      
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