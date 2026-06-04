'use client';

import Link from 'next/link';

export default function Disclaimer() {
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
              Disclaimer
            </h2>

            <div className="wooden-carved rounded-lg p-4 border-2 border-amber-600 space-y-4 text-sm text-amber-100">
              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">Educational Use</h3>
                <p className="leading-relaxed">
                  BUZZAR is designed as an educational gaming platform for learning and entertainment purposes. While we strive to provide accurate and up-to-date content, we make no warranties regarding the accuracy, completeness, or reliability of any information provided.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">User Responsibility</h3>
                <p className="leading-relaxed">
                  Users are responsible for ensuring that their use of BUZZAR complies with all applicable laws and regulations in their jurisdiction. We are not liable for any misuse of the platform or content provided.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">Limitation of Liability</h3>
                <p className="leading-relaxed">
                  BUZZAR and its creators shall not be held liable for any direct, indirect, incidental, special, or consequential damages resulting from the use of or inability to use the platform, including but not limited to data loss, business interruption, or any other damages.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">Third-Party Content</h3>
                <p className="leading-relaxed">
                  BUZZAR may contain links to third-party websites and services. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party sites is at your own risk and subject to their terms and conditions.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">Changes to Disclaimer</h3>
                <p className="leading-relaxed">
                  We reserve the right to modify this disclaimer at any time without notice. Your continued use of BUZZAR following any modifications constitutes your acceptance of the updated disclaimer.
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
              <Link href="/privacy-policy" className="block wooden-carved rounded-lg p-3 text-center text-amber-300 font-bold hover:bg-amber-900/20 transition border-2 border-amber-600">
                Privacy Policy
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
