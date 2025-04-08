import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';
import { settingsApi } from '../services/api';

interface SettingsData {
  username: string;
  password: string;
  merchantGuid: string;
  cardDeviceGuid: string;
  achDeviceGuid: string;
  enableDualPricing: boolean;
  cardPaymentSurcharge: number;
}

export default function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    username: '',
    password: '',
    merchantGuid: '',
    cardDeviceGuid: '',
    achDeviceGuid: '',
    enableDualPricing: false,
    cardPaymentSurcharge: 0,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsApi.getSettings();
      setSettings(response.data);
    } catch (error: any) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsApi.updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error: any) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Settings</h3>
        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Vendara Username
              </label>
              <input
                type="text"
                id="username"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Vendara Password
              </label>
              <input
                type="password"
                id="password"
                value={settings.password}
                onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="merchantGuid" className="block text-sm font-medium text-gray-700">
                Merchant GUID
              </label>
              <input
                type="text"
                id="merchantGuid"
                value={settings.merchantGuid}
                onChange={(e) => setSettings({ ...settings, merchantGuid: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="cardDeviceGuid" className="block text-sm font-medium text-gray-700">
                Card Device GUID
              </label>
              <input
                type="text"
                id="cardDeviceGuid"
                value={settings.cardDeviceGuid}
                onChange={(e) => setSettings({ ...settings, cardDeviceGuid: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="achDeviceGuid" className="block text-sm font-medium text-gray-700">
                ACH Device GUID
              </label>
              <input
                type="text"
                id="achDeviceGuid"
                value={settings.achDeviceGuid}
                onChange={(e) => setSettings({ ...settings, achDeviceGuid: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="cardPaymentSurcharge" className="block text-sm font-medium text-gray-700">
                Card Payment Surcharge (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                id="cardPaymentSurcharge"
                value={settings.cardPaymentSurcharge}
                onChange={(e) => setSettings({ ...settings, cardPaymentSurcharge: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableDualPricing"
              checked={settings.enableDualPricing}
              onChange={(e) => setSettings({ ...settings, enableDualPricing: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="enableDualPricing" className="ml-2 block text-sm text-gray-900">
              Enable Dual Pricing
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}