import React from 'react';
import { ShieldCheck, Zap, EyeOff, Award } from 'lucide-react';

const benefits = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
    title: 'Bypass AI Detection',
    description: 'Our advanced algorithms rewrite AI-generated text to be undetectable by AI checkers like Turnitin and GPTZero.'
  },
  {
    icon: <Zap className="w-10 h-10 text-blue-600" />,
    title: 'Instant Results',
    description: 'Get human-like text in seconds. No more waiting for manual rewrites or spending hours editing.'
  },
  {
    icon: <EyeOff className="w-10 h-10 text-blue-600" />,
    title: 'Privacy Guaranteed',
    description: 'Your content is never stored or shared. We process your text securely and privately.'
  },
  {
    icon: <Award className="w-10 h-10 text-blue-600" />,
    title: 'Premium Quality',
    description: 'Maintain the original meaning while transforming the writing style to sound authentically human.'
  }
];

export const Benefits: React.FC = () => {
  return (
    <section className="py-16 bg-white" id="benefits">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our AI Humanizer?
          </h2>
          <p className="text-lg text-gray-600">
            Transform robotic AI text into natural, human-like writing that passes all detection tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};