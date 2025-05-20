import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { TextareaWithCounter } from './ui/TextareaWithCounter';
import { HumanizeButton } from './ui/HumanizeButton';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from './auth/AuthModal';

export const Hero: React.FC = () => {
  const { user, profile } = useAuth();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleHumanize = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (profile?.plan === 'Free' && (profile.credits ?? 0) <= 0) {
      navigate('/pricing');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const humanized = inputText
        .split(' ')
        .map((word, i) => {
          if (i % 5 === 0) return word + (Math.random() > 0.5 ? ' actually' : ' essentially');
          if (i % 7 === 0) return 'quite ' + word;
          return word;
        })
        .join(' ');
      setOutputText(humanized);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-green-50 to-white">
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transform AI Text Into <span className="text-green-600">Human Writing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI Humanizer instantly makes AI-generated content sound natural, bypassing AI detection tools with just one click.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mt-8 max-w-6xl mx-auto">
          <div className="flex-1 rounded-lg shadow-md bg-white overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium text-gray-700">AI-Generated Text</h3>
            </div>
            <div className="p-4">
              <TextareaWithCounter
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your AI-generated text here..."
                maxLength={2000}
              />
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="hidden lg:block">
              <HumanizeButton 
                onClick={handleHumanize}
                isProcessing={isProcessing}
              />
            </div>
            <div className="lg:hidden">
              <ArrowRight className="w-8 h-8 text-green-600 mx-auto" />
            </div>
          </div>
          <div className="flex-1 rounded-lg shadow-md bg-white overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium text-gray-700">Humanized Text</h3>
            </div>
            <div className="p-4">
              <TextareaWithCounter
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                placeholder="Your humanized text will appear here..."
                maxLength={2000}
                readOnly={!outputText}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center lg:hidden">
          <HumanizeButton 
            onClick={handleHumanize}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </section>
  );
};