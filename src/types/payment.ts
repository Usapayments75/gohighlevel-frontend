export interface Invoice {
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

export interface PaymentResponse {
  guid: string;
  status: string;
  timeStamp: string;
  amount: number;
  currency: string;
  processorStatusCode: string;
  processorResponseMessage: string;
  authCode: string;
  refNumber: string;
  customerReceipt: string;
  card?: {
    first6: string;
    last4: string;
    cardType: string;
    cardHolderName: string;
  };
  bankAccount?: {
    guid: string;
    routingNumber: string;
    accountNumber: string;
    accountNumberLastFour: string;
    nameOnAccount: string;
  };
}