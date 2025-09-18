export type CreatePaymentDto = {
  amount: number;
  currency: string;
  referenceNumber: string;
  status: string;
  requestId: string;
};
