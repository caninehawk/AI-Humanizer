import React from 'react';
import { Clipboard as ClipboardText, Sparkles, FileText } from 'lucide-react';

const steps = [
  {
    icon: <ClipboardText className="w-12 h-12 text-purple-600" />,
    title: 'Paste AI Text',
    description: 'Simply copy and paste your AI-generated content into our editor.'
  },
  {
    icon: <Sparkles className="w-12 h-12 text-purple-600" />,
    title: 'Click Humanize',
    description: 'Our advanced algorithm transforms the text, keeping the meaning while changing the style.'
  },
  {
    icon: <FileText className="w-12 h-12 text-purple-600" />,
    title: 'Use Your Human Text',
    description: 'Copy your humanized text that\'s ready to use and will bypass AI detection tools.'
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50" id="how-it-works">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Transform your AI text into human writing in three simple steps.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2 z-0"></div>
          
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-purple-100 p-4 mb-6">
                    {step.icon}
                  </div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};