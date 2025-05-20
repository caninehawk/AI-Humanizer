import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Contact Us</h2>
        <p className="text-gray-600 mb-8 text-center">Have a question or want to work with us? Fill out the form below.</p>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm bg-gray-50"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm bg-gray-50"
            />
          </div>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm bg-gray-50"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm bg-gray-50 resize-none"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition-colors"
            disabled={submitted}
          >
            {submitted ? 'Message Sent' : 'Send Message'}
          </button>
          {submitted && (
            <div className="mt-4 text-center text-green-600 font-medium">
              Thank you for reaching out. We&apos;ll get back to you shortly.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}; 