import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const plans = [
  {
    label: 'Free',
    value: 'Free',
    credits: 20,
    description: 'Perfect for getting started. 20 credits per month.'
  },
  {
    label: 'Pro',
    value: 'Pro',
    credits: 100,
    description: 'For power users. 100 credits per month.'
  },
  {
    label: 'Enterprise',
    value: 'Enterprise',
    credits: 500,
    description: 'For teams and businesses. 500 credits per month.'
  }
];

// PaymentModal component
const PaymentModal: React.FC<{
  open: boolean;
  plan: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ open, plan, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    card: '',
    expiry: '',
    cvv: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onSuccess();
      onClose();
    }, 1200);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-8 mx-auto">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Upgrade to {plan}</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Credit Card Number</label>
            <input
              type="text"
              name="card"
              value={form.card}
              onChange={handleChange}
              required
              maxLength={19}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                required
                maxLength={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="MM/YY"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">CVV</label>
              <input
                type="password"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                required
                maxLength={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="123"
                inputMode="numeric"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition-colors mt-2"
          >
            {submitted ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
        <div className="text-center text-gray-500 text-sm mt-4">
          Payment simulation only – no real transaction will occur.
        </div>
      </div>
    </div>
  );
};

export const Pricing: React.FC = () => {
  const { user, profile } = useAuth();
  // Simulate plan change in UI only
  const [selectedPlan, setSelectedPlan] = useState(profile?.plan || 'Free');
  const [message, setMessage] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);

  const handleSwitchPlan = (plan: string) => {
    if (plan === 'Free') {
      setSelectedPlan('Free');
      setMessage('Your plan has been updated to Free. (Simulation only)');
    } else {
      setPendingPlan(plan);
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    if (pendingPlan) {
      setSelectedPlan(pendingPlan);
      setMessage(`Your plan has been updated to ${pendingPlan}. (Simulation only)`);
      setPendingPlan(null);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white py-16 px-4">
      <PaymentModal
        open={showPayment}
        plan={pendingPlan || ''}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCurrent = user && (selectedPlan === plan.value);
            return (
              <div
                key={plan.value}
                className={`rounded-xl shadow-lg p-8 flex flex-col items-center border-2 transition-all duration-200 ${
                  isCurrent ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.label}</h3>
                <div className="text-4xl font-extrabold text-green-600 mb-2">{plan.credits}</div>
                <div className="text-gray-600 mb-4">credits/month</div>
                <p className="text-gray-500 mb-6 text-center">{plan.description}</p>
                {user ? (
                  isCurrent ? (
                    <span className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold">Current Plan</span>
                  ) : (
                    <button
                      className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                      onClick={() => handleSwitchPlan(plan.value)}
                    >
                      {`Upgrade to ${plan.label}`}
                    </button>
                  )
                ) : (
                  <span className="px-6 py-2 rounded-full bg-gray-300 text-gray-600 font-semibold">Sign in to upgrade</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center text-gray-500 text-sm mt-8">
          {user ? (
            <>You are currently on the <span className="font-semibold text-green-700">{selectedPlan}</span> plan.</>
          ) : (
            <>Sign in to select or upgrade your plan.</>
          )}
        </div>
        {message && (
          <div className="mt-6 text-center text-green-600 font-semibold">
            {message}
          </div>
        )}
        <div className="text-center text-gray-400 text-xs mt-4">
          Plan switching is simulated – no real billing or upgrade will occur.
        </div>
      </div>
    </section>
  );
};