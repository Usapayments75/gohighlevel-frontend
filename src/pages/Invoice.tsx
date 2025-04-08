import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { DollarSign, Calculator, CreditCard } from 'lucide-react';
import { invoiceApi } from '../services/api';

export default function Invoice() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    dualPricing: true,
    surchargePercent: 3.5,
  });
  const [calculatedPrices, setCalculatedPrices] = useState<{
    cashPrice: number;
    cardPrice: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await invoiceApi.createInvoice({
        amount: parseFloat(formData.amount),
        dualPricing: formData.dualPricing,
        surchargePercent: formData.surchargePercent,
      });

      setCalculatedPrices({
        cashPrice: response.data.cashPrice,
        cardPrice: response.data.cardPrice,
      });
      toast.success('Invoice calculated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to calculate invoice');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create Invoice</h2>
        <p className="mt-1 text-sm text-gray-500">
          Calculate pricing with optional dual pricing and card payment surcharge.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Base Amount ($)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              id="amount"
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="100.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="dualPricing"
            checked={formData.dualPricing}
            onChange={(e) => setFormData({ ...formData, dualPricing: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="dualPricing" className="ml-2 block text-sm text-gray-900">
            Enable Dual Pricing
          </label>
        </div>

        {formData.dualPricing && (
          <div>
            <label htmlFor="surchargePercent" className="block text-sm font-medium text-gray-700">
              Card Payment Surcharge (%)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calculator className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                id="surchargePercent"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.surchargePercent}
                onChange={(e) => setFormData({ ...formData, surchargePercent: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isProcessing ? 'Calculating...' : 'Calculate Invoice'}
          </button>
        </div>
      </form>

      {calculatedPrices && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900">Calculated Prices</h3>
          <div className="mt-4 space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Cash Price:</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ${calculatedPrices.cashPrice.toFixed(2)}
                </span>
              </div>
            </div>
            {formData.dualPricing && (
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Card Price:</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ${calculatedPrices.cardPrice.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Includes {formData.surchargePercent}% card payment surcharge
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}