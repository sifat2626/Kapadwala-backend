
// Extend the Stripe module
declare module 'stripe' {
  namespace Stripe {
    interface Invoice {
      payment_intent?: string | Stripe.PaymentIntent; // Use `Stripe.PaymentIntent`
    }
  }
}
