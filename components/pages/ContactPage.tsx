

import React, { useState, FormEvent } from 'react';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate API call
    setTimeout(() => {
      // For demonstration, we'll just assume success
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
      // Reset form after a few seconds
      setTimeout(() => setStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl animate-page-enter">
      <h1 className="text-4xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 text-slate-300 leading-relaxed">
          <p>
            Have a question, suggestion, or just want to say hi? We'd love to hear from you! Please use the form to get in touch with our team.
          </p>
          <p>
            We'll do our best to respond to your inquiry as soon as possible. Please note that this is a fan-run platform and we cannot forward messages to celebrities or their official representatives.
          </p>
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-white">General Inquiries:</h3>
            <p className="text-purple-300">contact@fanzadda.com</p>
          </div>
        </div>

        <div>
          {status === 'sent' ? (
            <div className="h-full flex flex-col items-center justify-center bg-slate-700/50 rounded-lg p-8 text-center">
               <span className="material-symbols-outlined text-6xl text-green-400">check_circle</span>
              <h2 className="text-2xl font-bold text-white mt-4">Message Sent!</h2>
              <p className="text-slate-300 mt-2">Thank you for contacting us. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Your Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold rounded-full transition duration-300"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;