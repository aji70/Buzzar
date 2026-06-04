'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#2a1810] via-[#1a1008] to-[#0f0905]">
      <div className="mx-auto w-full max-w-[560px] flex flex-col min-h-screen bg-gradient-to-b from-[#2a1810] via-[#1a1008] to-[#0f0905] relative">
        {/* HEADER */}
        <header className="wooden-carved rounded-b-2xl mx-2 mt-2 px-4 py-3 flex justify-between items-center border-b-4 border-orange-600 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-float">🐝</span>
            <h1 className="title-glow text-2xl" style={{ fontSize: '1.5rem' }}>
              BUZZAR
            </h1>
          </div>
          <Link href="/" className="text-2xl hover:scale-110 transition-transform">
            ✕
          </Link>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto pb-6">
          <section className="mx-3 mt-4">
            <h2 className="text-3xl font-black text-amber-300 mb-2" style={{ fontFamily: "'Fredoka One'" }}>
              Contact Us
            </h2>
            <p className="text-amber-100 text-sm mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>

            {/* Contact Info */}
            <div className="wooden-carved rounded-lg p-4 border-2 border-amber-600 mb-4 space-y-3">
              <div>
                <p className="text-xs text-amber-300 font-bold mb-1">📧 Email</p>
                <p className="text-sm text-amber-100">support@buzzar.com</p>
              </div>
              <div>
                <p className="text-xs text-amber-300 font-bold mb-1">💬 Discord</p>
                <p className="text-sm text-amber-100">Join our community server</p>
              </div>
              <div>
                <p className="text-xs text-amber-300 font-bold mb-1">🌐 Response Time</p>
                <p className="text-sm text-amber-100">Usually within 24-48 hours</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="wooden-carved rounded-lg p-4 border-2 border-amber-600 mb-4">
              <h3 className="font-black text-amber-300 mb-4 text-base">Send us a Message</h3>

              {submitted && (
                <div className="bg-green-900/40 border-2 border-green-600 rounded p-3 mb-4 text-center">
                  <p className="text-green-300 font-bold text-sm">✓ Message sent successfully!</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-amber-300 font-bold block mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-amber-900/20 border border-amber-600 rounded px-3 py-2 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-400 text-sm"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="text-xs text-amber-300 font-bold block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-amber-900/20 border border-amber-600 rounded px-3 py-2 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-400 text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="text-xs text-amber-300 font-bold block mb-1">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-amber-900/20 border border-amber-600 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-400 text-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="bug">🐛 Bug Report</option>
                    <option value="feature">💡 Feature Request</option>
                    <option value="feedback">📝 General Feedback</option>
                    <option value="support">🆘 Support</option>
                    <option value="partnership">🤝 Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-amber-300 font-bold block mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-amber-900/20 border border-amber-600 rounded px-3 py-2 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-400 text-sm resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-cta btn-hive-master py-3 rounded font-black text-sm"
                >
                  📨 SEND MESSAGE
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div className="wooden-carved rounded-lg p-4 border-2 border-amber-600 mb-4">
              <h3 className="font-black text-amber-300 mb-3 text-base">❓ Quick FAQ</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-amber-300 font-bold">How do I reset my password?</p>
                  <p className="text-amber-100 text-xs mt-1">Click "Forgot Password" on the login page and follow the instructions.</p>
                </div>
                <div>
                  <p className="text-amber-300 font-bold">Why can't I access my account?</p>
                  <p className="text-amber-100 text-xs mt-1">Check if your account is active. Email us if you need account recovery assistance.</p>
                </div>
                <div>
                  <p className="text-amber-300 font-bold">How are leaderboard rankings calculated?</p>
                  <p className="text-amber-100 text-xs mt-1">Rankings are based on total points earned across all game modes. Streaks and bonuses boost your score!</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="wooden-carved rounded-lg p-4 border-2 border-amber-600 text-center mb-4">
              <p className="text-amber-300 font-bold text-sm mb-3">Follow BUZZAR on Social Media</p>
              <div className="flex justify-center gap-4">
                <a href="#" className="text-2xl hover:scale-110 transition-transform" title="Twitter">🐦</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform" title="Facebook">📘</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform" title="Instagram">📷</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform" title="YouTube">🎬</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform" title="Discord">💬</a>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-4 space-y-2">
              <Link href="/disclaimer" className="block wooden-carved rounded-lg p-3 text-center text-amber-300 font-bold hover:bg-amber-900/20 transition border-2 border-amber-600">
                Disclaimer
              </Link>
              <Link href="/privacy-policy" className="block wooden-carved rounded-lg p-3 text-center text-amber-300 font-bold hover:bg-amber-900/20 transition border-2 border-amber-600">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="block wooden-carved rounded-lg p-3 text-center text-amber-300 font-bold hover:bg-amber-900/20 transition border-2 border-amber-600">
                Terms & Conditions
              </Link>
              <Link href="/" className="block wooden-carved rounded-lg p-3 text-center text-orange-400 font-bold hover:bg-orange-900/20 transition border-2 border-orange-600">
                ← Back to Home
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
