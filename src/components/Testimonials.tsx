import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "This tool completely transformed my AI-written content into something that feels genuinely human. My professor couldn't tell the difference!",
    author: "Sarah Johnson",
    role: "Graduate Student",
    stars: 5,
    avatarUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    quote: "I was skeptical at first, but AI Humanizer has become an essential tool for my content agency. It saves us hours of editing time.",
    author: "Michael Chen",
    role: "Content Agency Owner",
    stars: 5,
    avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    quote: "The quality of the humanized text is remarkable. It retains all the key information while sounding completely natural.",
    author: "Emily Rodriguez",
    role: "Marketing Director",
    stars: 4,
    avatarUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600">
            Thousands of users trust our AI Humanizer to transform their content.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center mt-4">
                <img 
                  src={testimonial.avatarUrl} 
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};