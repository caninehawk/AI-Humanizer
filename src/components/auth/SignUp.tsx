import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface SignUpProps {
  onSuccess?: () => void;
  onSwitch?: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSuccess, onSwitch }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Sign up the user (Supabase will send a confirmation email)
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { name: formData.name },
        },
      });
      if (authError) throw authError;
      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md mx-auto">
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
        Create your account
      </h2>
      {emailSent ? (
        <div className="text-green-600 text-center mb-4">
          Check your email to confirm your account and complete registration.
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
          <div className="text-sm text-center mt-2">
            <button
              type="button"
              className="text-green-600 hover:text-green-500 font-medium"
              onClick={onSwitch}
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      )}
    </div>
  );
}; 