interface CheckoutSessionRequest {
  plan: string;
  customerEmail: string;
  billingCycle: 'monthly' | 'yearly';
}

interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

class StripeService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  async createCheckoutSession(data: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Stripe service error:', error);
      throw error;
    }
  }

  async verifySession(sessionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to verify session');
      }

      return await response.json();
    } catch (error) {
      console.error('Session verification error:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
export default stripeService;