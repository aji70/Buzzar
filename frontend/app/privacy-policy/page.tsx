'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
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
            <h2 className="text-3xl font-black text-amber-300 mb-4" style={{ fontFamily: "'Fredoka One'" }}>
              Privacy Policy
            </h2>

            <div className="wooden-carved rounded-lg p-4 border-2 border-amber-600 space-y-4 text-sm text-amber-100">
              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">Introduction</h3>
                <p className="leading-relaxed">
                  BUZZAR ("we," "us," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our gaming platform.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">Information We Collect</h3>
                <p className="leading-relaxed mb-2">We may collect information about you in a variety of ways:</p>
                <ul className="list-disc list-inside space-y-1 text-amber-200">
                  <li>Account information (username, email, password)</li>
                  <li>Game performance data and statistics</li>
                  <li>Device information and IP address</li>
                  <li>Usage patterns and preferences</li>
                  <li>Location data (if permitted)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">How We Use Your Information</h3>
                <p className="leading-relaxed mb-2">We use the information we collect for:</p>
                <ul className="list-disc list-inside space-y-1 text-amber-200">
                  <li>Providing and improving our services</li>
                  <li>Personalizing your gaming experience</li>
                  <li>Sending promotional communications (with consent)</li>
                  <li>Maintaining account security</li>
                  <li>Analyzing usage patterns</li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">Data Security</h3>
                <p className="leading-relaxed">
                  We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">Third-Party Sharing</h3>
                <p className="leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share data only when required by law or with your explicit consent.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">Your Rights</h3>
                <p className="leading-relaxed">
                  You have the right to access, correct, or delete your personal information. Contact us at support@buzzar.com to exercise these rights.
                </p>
              </div>

              <div className="pt-4 border-t border-amber-700">
                <p className="text-xs text-amber-300 font-semibold">
                  Last updated: June 2024
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-6 space-y-2">
              <Link href="/disclaimer" className="block wooden-carved rounded-lg p-3 text-center text-amber-300 font-bold hover:bg-amber-900/20 transition border-2 border-amber-600">
                Disclaimer
              </Link>
              <Link href="/terms-and-conditions" className="block wooden-carved rounded-lg p-3 text-center text-amber-300 font-bold hover:bg-amber-900/20 transition border-2 border-amber-600">
                Terms & Conditions
              </Link>
              <Link href="/contact-us" className="block wooden-carved rounded-lg p-3 text-center text-amber-300 font-bold hover:bg-amber-900/20 transition border-2 border-amber-600">
                Contact Us
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
