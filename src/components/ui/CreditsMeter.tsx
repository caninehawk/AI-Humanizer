import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const CreditsMeter: React.FC = () => {
  const { profile } = useAuth();
  const creditsUsed = profile?.credits_used || 0;
  const totalCredits = 10; // Always 10 for everyone

  const calculateProgress = () => (creditsUsed / totalCredits) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-green-600">Available Credits</span>
          <span className="text-gray-900">{totalCredits - creditsUsed} remaining</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-300 bg-green-600"
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Used: {creditsUsed}</span>
        <span className="text-gray-600">Total: {totalCredits}</span>
      </div>
      {calculateProgress() >= 90 && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
          <span className="font-bold mr-2">!</span>
          <span>You're running low on credits!</span>
        </div>
      )}
    </div>
  );
}; 