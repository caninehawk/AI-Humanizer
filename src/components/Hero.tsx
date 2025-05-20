import React, { useState, useCallback } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { TextareaWithCounter } from './ui/TextareaWithCounter';
import { HumanizeButton } from './ui/HumanizeButton';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from './auth/AuthModal';
import { supabase } from '../lib/supabase';
import { CreditsMeter } from './ui/CreditsMeter';

const API_KEY = 'dd410c04-f157-4f4c-9e41-b7d125f2b339';
const MIN_CHARS = 50;

export const Hero: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [refreshMeter, setRefreshMeter] = useState(false);

  const navigate = useNavigate();

  const updateUserCredits = async () => {
    if (!user) return;

    try {
      const newCreditsUsed = (profile?.credits_used || 0) + 1;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits_used: newCreditsUsed })
        .eq('id', user.id);

      if (updateError) {
        console.error('Supabase update error:', updateError);
        return;
      }

      // Fetch the latest profile from Supabase and update context
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        return;
      }

      await updateProfile(updatedProfile); // This will now fetch and update context
      setRefreshMeter((prev) => !prev); // 🔄 Force CreditsMeter re-render
    } catch (error) {
      console.error('Unhandled error updating credits:', error);
    }
  };

  const pollDocumentStatus = useCallback(async (documentId: string) => {
    try {
      const response = await fetch('https://humanize.undetectable.ai/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY,
        },
        body: JSON.stringify({ id: documentId }),
      });

      if (!response.ok) throw new Error('Failed to check document status');

      const data = await response.json();

      if (data.output) {
        setOutputText(data.output);
        setIsProcessing(false);

        // Insert project row in Supabase
        if (user && inputText) {
          try {
            await supabase.from('projects').insert({
              user_id: user.id,
              input_text: inputText,
              output_text: data.output,
              created_at: new Date().toISOString(),
            });
          } catch (err) {
            console.error('Error inserting project:', err);
          }
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error polling document status:', error);
      setError('Failed to check document status. Please try again.');
      setIsProcessing(false);
      return true;
    }
  }, [user, inputText]);

  const handleHumanize = async () => {
    setError(null);

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const creditsUsed = profile?.credits_used || 0;
    const totalCredits = profile?.plan === 'Free' ? 10 : profile?.plan === 'Pro' ? 100 : 500;

    if (creditsUsed >= totalCredits) {
      setShowUpgradeModal(true);
      return;
    }

    if (inputText.length < MIN_CHARS) {
      setError(`Please enter at least ${MIN_CHARS} characters`);
      return;
    }

    setIsProcessing(true);

    try {
      const submitResponse = await fetch('https://humanize.undetectable.ai/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY,
        },
        body: JSON.stringify({
          content: inputText,
          readability: 'High School',
          purpose: 'General Writing',
          strength: 'More Human',
          model: 'v11',
        }),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        if (submitResponse.status === 402) {
          throw new Error('Insufficient credits. Please upgrade your plan.');
        }
        throw new Error(errorData.message || 'Failed to submit text for humanization');
      }

      const { id } = await submitResponse.json();

      const pollInterval = setInterval(async () => {
        const isComplete = await pollDocumentStatus(id);
        if (isComplete) {
          clearInterval(pollInterval);
          await updateUserCredits(); // Only update credits after successful completion
        }
      }, 5000);

      setTimeout(() => {
        clearInterval(pollInterval);
        if (isProcessing) {
          setError('Request timed out. Please try again.');
          setIsProcessing(false);
        }
      }, 300000);
    } catch (error) {
      console.error('Error humanizing text:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while humanizing the text');
      setIsProcessing(false);
    }
  };

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-green-50 to-white">
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Credits Depleted</h3>
            <p className="text-gray-600 text-center mb-6">
              You have used all your free credits. Upgrade to Pro to continue using the app and get more features!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Upgrade Now
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transform AI Text Into <span className="text-green-600">Human Writing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI Humanizer instantly makes AI-generated content sound natural, bypassing AI detection tools with just one click.
          </p>
        </div>

        {user && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Your Credit Usage</h3>
              <CreditsMeter key={refreshMeter ? '1' : '0'} />
            </div>
          </div>
        )}

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
              <HumanizeButton onClick={handleHumanize} isProcessing={isProcessing} />
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

        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="mt-6 flex justify-center lg:hidden">
          <HumanizeButton onClick={handleHumanize} isProcessing={isProcessing} />
        </div>
      </div>
    </section>
  );
};
