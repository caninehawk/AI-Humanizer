import React, { useState } from 'react';
import { Login } from './Login';
import { SignUp } from './SignUp';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-md mx-auto">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {mode === 'login' ? (
          <Login
            onSuccess={onClose}
            onSwitch={() => setMode('signup')}
          />
        ) : (
          <SignUp
            onSuccess={onClose}
            onSwitch={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
}; 