import { API_CONFIG, getApiUrl } from '../config/api';

export interface CreateSubscriptionRequest {
  plan: string;
  periodicity: 'monthly' | 'annual';
  paymentProvider: 'mercadopago' | 'paypal';
  phoneE164: string;
  email: string;
}

export interface CreateSubscriptionResponse {
  success: true;
  data: {
    checkoutUrl: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    plan: string;
    periodicity: string;
    paymentProvider: string;
  };
}

export interface CreateSubscriptionError {
  success: false;
  error: string;
  details?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
  message?: string;
}

export class SubscriptionService {
  static async createSubscription(
    data: CreateSubscriptionRequest
  ): Promise<CreateSubscriptionResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CREATE_SUBSCRIPTION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw result as CreateSubscriptionError;
      }

      return result as CreateSubscriptionResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          success: false,
          error: 'El servidor está tardando demasiado en responder. Por favor, intenta de nuevo.',
        } as CreateSubscriptionError;
      }
      
      throw error;
    }
  }
}