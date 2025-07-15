// Payment success parameters types
export interface MercadoPagoParams {
  preapproval_id: string;
}

export interface PayPalParams {
  subscription_id: string;
  ba_token: string;
  token: string;
}

export type PaymentParams = MercadoPagoParams | PayPalParams;

export interface PaymentSuccessProps {
  paymentProvider: 'mercadopago' | 'paypal' | null;
  params: PaymentParams | null;
  isValid: boolean;
}