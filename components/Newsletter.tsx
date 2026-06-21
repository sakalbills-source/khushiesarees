'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setDone(true);
  }

  return (
    <section className="bg-charcoal text-white py-16">
      <div className="container-px max-w-2xl text-center">
        <h2 className="font-serif text-3xl text-gold mb-3">Join the KSarees Family</h2>
        <p className="text-gray-300 mb-6">
          Subscribe for early access to new collections, exclusive offers and
          styling tips.
        </p>
        {done ? (
          <p className="text-gold font-medium">
            ✦ Thank you for subscribing! Check your inbox.
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 max-w-sm rounded-sm px-4 py-3 text-charcoal focus:outline-none"
            />
            <button type="submit" className="btn-gold">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
