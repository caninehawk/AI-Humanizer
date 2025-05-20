import React from 'react';
import { Link } from 'react-router-dom';

export const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white" id="cta">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make Your AI Content Undetectable?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students, content creators, and professionals who use our AI Humanizer to transform their content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#" 
              className="px-8 py-3 rounded-full bg-white text-green-600 font-medium hover:bg-gray-100 transition-colors shadow-md"
            >
              Get Started Free
            </a>
            <Link 
              to="/pricing" 
              className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
          
          <p className="mt-6 text-sm opacity-80">
            No credit card required. Start with our free plan today.
          </p>
        </div>
      </div>
    </section>
  );
};