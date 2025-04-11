import axios from 'axios';

const API_BASE_URL = 'https://api-vendara.usapayments.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await api.post('/auth/forgotpassword', data);
    return response.data;
  },

  verifyOtp: async (data: { email: string; otp: string }) => {
    const response = await api.post('/auth/verifyotp', data);
    return response.data;
  },

  resetPassword: async (data: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    const response = await api.post('/auth/resetpassword', data);
    return response.data;
  },
};

export const settingsApi = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (data: {
    username: string;
    password: string;
    merchantGuid: string;
    cardDeviceGuid: string;
    achDeviceGuid: string;
    enableDualPricing: boolean;
    cardPaymentSurcharge: number;
  }) => {
    const response = await api.put('/settings', data);
    return response.data;
  },
};

export const statusApi = {
  checkStatus: async (transactionId: string) => {
    const response = await api.get(`/status/${transactionId}`);
    return response.data;
  },
};

export const paymentApi = {
  processCardPayment: async (data: {
    amount: number;
    currency: string;
    invoiceId: string;
    card: {
      cardNumber: string;
      cardHolderName: string;
      expirationDate: string;
      cvv: string;
    };
    deviceGuid: string;
  }) => {
    const response = await api.post('/payment/card', data);
    return response.data;
  },

  processAchPayment: async (data: {
    amount: number;
    currency: string;
    invoiceId: string;
    bankAccount: {
      routingNumber: string;
      accountNumber: string;
      nameOnAccount: string;
    };
    deviceGuid: string;
  }) => {
    const response = await api.post('/payment/ach', data);
    return response.data;
  },
};

export const invoiceApi = {
  createInvoice: async (data: {
    amount: number;
    dualPricing: boolean;
    surchargePercent: number;
  }) => {
    const response = await api.post('/invoice/create', data);
    return response.data;
  },
};