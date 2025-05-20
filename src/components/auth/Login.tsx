import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface LoginProps {
  onSuccess?: () => void;
  onSwitch?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onSwitch }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md mx-auto">
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
        Sign in to your account
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
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
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="text-sm text-center mt-2">
          <button
            type="button"
            className="text-green-600 hover:text-green-500 font-medium"
            onClick={onSwitch}
          >
            Don't have an account? Sign up
          </button>
        </div>
      </form>
    </div>
  );
}; 