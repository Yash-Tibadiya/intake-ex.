import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Check, ClipboardCheck, FileLock2, HandCoins, Info, Lock, ShieldPlus } from "lucide-react";

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
  "pk_test_51RlpX1QjhiNa6FtXBK1vbrwUhQmbfs7pg1OKWwQGogZq4eR3L92ILGCnE2XVYEJpyafRO2DQtZwhV3HgFJ1nlpii00EBeEHZ7F"
);

interface StripePaymentProps {
  amount?: number;
  currency?: string;
  onPaymentSuccess?: (paymentIntent: any) => void;
  onPaymentError?: (error: any) => void;
  label?: string;
  monthlyPrice?: number;
  duration?: string;
  savings?: number;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#374151",
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
};

const PaymentForm: React.FC<StripePaymentProps> = ({
  amount = 258,
  currency = "usd",
  onPaymentSuccess,
  onPaymentError,
  label,
  monthlyPrice,
  duration,
  savings,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("idle");
    setErrorMessage("");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage("Card element not found");
      setIsProcessing(false);
      return;
    }

    try {
      const { error: paymentMethodError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (paymentMethodError) {
        setErrorMessage(
          paymentMethodError.message || "Payment method creation failed"
        );
        setPaymentStatus("error");
        setIsProcessing(false);
        onPaymentError?.(paymentMethodError);
        return;
      }

      // Simulate payment processing
      setTimeout(() => {
        setPaymentStatus("success");
        setIsProcessing(false);
        onPaymentSuccess?.({
          id: "pi_demo_" + Date.now(),
          status: "succeeded",
          amount: amount * 100,
          currency: currency,
        });
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "Payment failed");
      setPaymentStatus("error");
      setIsProcessing(false);
      onPaymentError?.(error);
    }
  };

  return (
    <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-md sm:text-2xl font-bold text-gray-900">
              Complete Your Order
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Secure payment for your semaglutide plan
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full min-w-[110px]">
            <Lock className="w-4 h-4 text-green-700" />
            <span className="text-green-700 text-[10px] sm:text-sm font-medium inline-block">
              SSL Secured
            </span>
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-8">
        {/* Plan Summary */}
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-8 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Plan Summary
              </h3>
              {label && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-900 font-medium">{label}</span>
                  {savings && savings > 0 && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Save ${savings}
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                {monthlyPrice && duration && (
                  <div className="flex justify-between">
                    <span>Monthly cost:</span>
                    <span className="font-medium text-gray-900">
                      ${monthlyPrice}/month
                    </span>
                  </div>
                )}
                {duration && (
                  <div className="flex justify-between">
                    <span>Treatment duration:</span>
                    <span className="font-medium text-gray-900">
                      {duration}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Payment type:</span>
                  <span className="font-medium text-gray-900">
                    One-time payment
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Total Amount
              </span>
              <span className="text-3xl font-bold text-gray-900">
                ${amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-800">
                  Payment Successful!
                </h3>
                <p className="text-green-700 mt-1">
                  Your semaglutide plan is now active. Check your email for next
                  steps.
                </p>
              </div>
            </div>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">
                  Payment Failed
                </h3>
                <p className="text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Payment Information
            </label>
            <div className="border-2 border-gray-200 rounded-2xl p-6 bg-white hover:border-gray-300 transition-colors duration-200 focus-within:ring-4 focus-within:ring-[#193231]/10 focus-within:border-[#193231]">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <div className="flex items-center mt-3 text-xs text-gray-500">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Your payment information is encrypted and secure
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || isProcessing || paymentStatus === "success"}
            className={`w-full py-4 px-8 rounded-2xl font-semibold text-white text-lg transition-all duration-300 transform ${
              isProcessing || paymentStatus === "success"
                ? "bg-gray-400 cursor-not-allowed scale-100"
                : "bg-[#193231] hover:bg-[#193231]/90 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Payment...
              </div>
            ) : paymentStatus === "success" ? (
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Payment Completed
              </div>
            ) : (
              `Complete Payment - $${amount.toFixed(2)}`
            )}
          </button>
        </form>

        {/* What's Included */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-200 mt-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <ClipboardCheck className="w-6 h-6 mr-2" />
            What&apos;s Included in Your Plan
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start">
              <Check className="w-4 h-4 text-[#193231] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                Personalized dosage tracking
              </span>
            </div>
            <div className="flex items-start">
              <Check className="w-4 h-4 text-[#193231] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                Weight loss progress monitoring
              </span>
            </div>
            <div className="flex items-start">
              <Check className="w-4 h-4 text-[#193231] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Daily medication reminders</span>
            </div>
            <div className="flex items-start">
              <Check className="w-4 h-4 text-[#193231] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Side effect management</span>
            </div>
            <div className="flex items-start">
              <Check className="w-4 h-4 text-[#193231] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Nutrition guidance</span>
            </div>
            <div className="flex items-start">
              <Check className="w-4 h-4 text-[#193231] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">24/7 app access</span>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FileLock2 className="w-5 h-5 text-[#193231]" />
              </div>
              <span className="text-xs text-gray-600 font-medium">
                256-bit SSL
              </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ShieldPlus className="w-5 h-5 text-[#193231]" />
              </div>
              <span className="text-xs text-gray-600 font-medium">
                HIPAA Compliant
              </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-[#193231]" />
              </div>
              <span className="text-xs text-gray-600 font-medium">
                24/7 Support
              </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <HandCoins className="w-5 h-5 text-[#193231]" />
              </div>
              <span className="text-xs text-gray-600 font-medium">
                Money Back
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StripePayment: React.FC<StripePaymentProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePayment;