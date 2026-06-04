'use client';

import Link from 'next/link';

export default function TermsAndConditions() {
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
              Terms & Conditions
            </h2>

            <div className="wooden-carved rounded-lg p-4 border-2 border-amber-600 space-y-4 text-sm text-amber-100">
              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">1. Acceptance of Terms</h3>
                <p className="leading-relaxed">
                  By accessing and using BUZZAR, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">2. Use License</h3>
                <p className="leading-relaxed">
                  Permission is granted to temporarily download one copy of the materials (information or software) on BUZZAR for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-1 text-amber-200 mt-2">
                  <li>Modifying or copying the materials</li>
                  <li>Using the materials for any commercial purpose or any public display</li>
                  <li>Attempting to reverse engineer any software contained on BUZZAR</li>
                  <li>Transmitting or storing illegally obtained material</li>
                  <li>Removing any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">3. Disclaimer</h3>
                <p className="leading-relaxed">
                  The materials on BUZZAR are provided on an "as is" basis. BUZZAR makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">4. Limitations</h3>
                <p className="leading-relaxed">
                  In no event shall BUZZAR or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BUZZAR.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">5. Accuracy of Materials</h3>
                <p className="leading-relaxed">
                  The materials appearing on BUZZAR could include technical, typographical, or photographic errors. BUZZAR does not warrant that any of the materials on its website are accurate, complete, or current.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">6. Modifications</h3>
                <p className="leading-relaxed">
                  BUZZAR may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </div>

              <div>
                <h3 className="font-black text-amber-300 mb-2 text-base">7. Governing Law</h3>
                <p className="leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which BUZZAR operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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
              <Link href="/privacy-policy" className="block wooden-carved rounded-lg p-3 text-center text-amber-300 font-bold hover:bg-amber-900/20 transition border-2 border-amber-600">
                Privacy Policy
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
