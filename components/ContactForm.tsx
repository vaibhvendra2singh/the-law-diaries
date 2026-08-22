'use client';

// components/ContactForm.tsx
// Contact form matching exact home page serif typography and black button pill design

import { useState, useRef } from 'react';

export default function ContactForm() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError]     = useState('');
  const honeypotRef           = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          honeypot: honeypotRef.current?.value ?? '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setName(''); setEmail(''); setMessage('');
    } catch {
      setError('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot field */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
        <label htmlFor="hp_website">Leave this blank</label>
        <input ref={honeypotRef} id="hp_website" name="hp_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block font-serif text-sm font-semibold text-[#1A1A1A] mb-2">
            Your Name <span className="text-black">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full border border-neutral-300 rounded-full px-5 py-2.5 font-serif text-sm
                       text-[#1A1A1A] bg-white focus:outline-none focus:border-black shadow-sm"
            placeholder="e.g. A. Sharma"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block font-serif text-sm font-semibold text-[#1A1A1A] mb-2">
            Email Address <span className="text-black">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={200}
            className="w-full border border-neutral-300 rounded-full px-5 py-2.5 font-serif text-sm
                       text-[#1A1A1A] bg-white focus:outline-none focus:border-black shadow-sm"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block font-serif text-sm font-semibold text-[#1A1A1A] mb-2">
          Message <span className="text-black">*</span>
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={3000}
          rows={6}
          className="w-full border border-neutral-300 rounded-2xl px-5 py-3 font-serif text-sm
                     text-[#1A1A1A] bg-white focus:outline-none focus:border-black shadow-sm
                     resize-vertical"
          placeholder="Write your message here..."
        />
        <p className="font-serif text-xs text-neutral-400 mt-1 text-right">
          {message.length}/3000
        </p>
      </div>

      {/* Messages */}
      {status === 'error' && (
        <p className="font-serif text-sm text-red-600 font-semibold">{error}</p>
      )}

      {status === 'success' && (
        <div className="p-4 border border-black bg-neutral-50 rounded-xl font-serif text-sm text-black font-semibold">
          Thank you for reaching out. Your message has been sent successfully.
        </div>
      )}

      {/* Submit button */}
      <div className="pt-2 flex justify-start">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-black text-white px-8 py-3 rounded-full font-serif text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
        >
          {status === 'sending' ? 'Sending Message…' : 'Submit Message'}
        </button>
      </div>
    </form>
  );
}
