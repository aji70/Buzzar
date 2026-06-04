'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

export default function Home() {
  const [soundOn, setSoundOn] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const closeMenus = useCallback(() => {
    setShowUserMenu(false);
    setShowMainMenu(false);
  }, []);

  return (
    <div className="min-h-dvh w-full flex justify-center bg-gradient-to-b from-[#2a1810] via-[#1a1008] to-[#0f0905]">
      <div ref={shellRef} className="app-shell mx-auto w-full max-w-[560px] flex flex-col bg-gradient-to-b from-[#2a1810] via-[#1a1008] to-[#0f0905] border-8 border-[#1a1008]" style={{ position: 'relative', boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8), inset 0 4px 20px rgba(0, 0, 0, 0.6)' }}>
        {/* HEADER */}
        <header className="header-nav rounded-b-2xl mx-2 mt-2 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
          {/* Logo & Mascot */}
          <div className="flex items-center gap-2">
            <img
              src="/assets/bee_happy_bucket.png"
              alt="Buzzar bee"
              style={{
                height: '36px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(245,158,11,0.3))',
              }}
            />
            <h1 className="header-logo text-2xl" style={{ fontSize: '1.5rem' }}>
              BUZZAR
            </h1>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="p-2 hover:scale-110 transition-transform text-2xl"
              title={soundOn ? 'Sound On' : 'Sound Off'}
            >
              {soundOn ? '🔊' : '🔇'}
            </button>

            {/* User Menu Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(true);
                setShowMainMenu(false);
              }}
              className="p-2 hover:scale-110 transition-transform text-2xl"
              aria-expanded={showUserMenu}
              aria-haspopup="dialog"
            >
              👤
            </button>

            {/* Main Menu Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMainMenu(true);
                setShowUserMenu(false);
              }}
              className="p-2 hover:scale-110 transition-transform text-2xl"
              aria-expanded={showMainMenu}
              aria-haspopup="dialog"
            >
              ☰
            </button>
          </div>
        </header>

        {mounted &&
          (showUserMenu || showMainMenu) &&
          createPortal(
            <>
              {/* Shared overlay */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                style={{ zIndex: 9998 }}
                onClick={closeMenus}
                aria-hidden="true"
              />

              {/* User Menu — centered modal, 80% screen height */}
              {showUserMenu && (
                <div
                  className="wooden-carved rounded-2xl shadow-2xl border-2 border-[#4a2005] flex flex-col"
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(480px, 92vw)',
                    maxHeight: '80vh',
                    zIndex: 9999,
                  }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="User menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-5 border-b border-[#3a1804] flex items-center justify-between shrink-0">
                    <div>
                      <p className="text-amber-300 font-bold text-base">Guest User</p>
                      <p className="text-amber-100 text-sm">Player ID: #12345</p>
                    </div>
                    <button
                      type="button"
                      onClick={closeMenus}
                      className="text-amber-400 hover:text-amber-200 text-2xl leading-none"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  {/* Items */}
                  <div className="flex-1 overflow-y-auto themed-scrollbar">
                    <button type="button" className="w-full text-left px-6 py-4 text-amber-100 hover:bg-amber-900/30 transition text-base font-semibold border-b border-[#3a1804]/50">
                      📊 My Stats
                    </button>
                    <button type="button" className="w-full text-left px-6 py-4 text-amber-100 hover:bg-amber-900/30 transition text-base font-semibold border-b border-[#3a1804]/50">
                      🎮 My Games
                    </button>
                    <button type="button" className="w-full text-left px-6 py-4 text-amber-100 hover:bg-amber-900/30 transition text-base font-semibold border-b border-[#3a1804]/50">
                      ⚙️ Settings
                    </button>
                    <button type="button" className="w-full text-left px-6 py-4 text-red-400 hover:bg-red-900/20 transition text-base font-semibold">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </>,
            document.body
          )}

        {/* Main Menu drawer — portalled into shell so it's scoped to container width */}
        {mounted && showMainMenu && shellRef.current &&
          createPortal(
            <div
              className="wooden-carved shadow-2xl border-l-2 border-[#4a2005] flex flex-col"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                width: 'min(320px, 85%)',
                zIndex: 9999,
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer header */}
              <div className="p-4 border-b border-[#3a1804] bg-amber-900/30 flex items-center justify-between shrink-0">
                <div>
                  <p className="text-amber-300 font-bold">BUZZAR</p>
                  <p className="text-amber-100 text-xs">Where Knowledge Creates a Buzz</p>
                </div>
                <button
                  type="button"
                  onClick={closeMenus}
                  className="text-amber-400 hover:text-amber-200 text-2xl leading-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto themed-scrollbar py-2">
                <p className="text-amber-300 font-bold text-xs uppercase px-4 py-2 mt-1">Legal</p>
                <Link href="/disclaimer" className="block px-6 py-3 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold" onClick={closeMenus}>
                  📋 Disclaimer
                </Link>
                <Link href="/privacy-policy" className="block px-6 py-3 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold" onClick={closeMenus}>
                  🔐 Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className="block px-6 py-3 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold" onClick={closeMenus}>
                  ✅ Terms & Conditions
                </Link>

                <div className="border-t border-[#3a1804]/50 mt-2 pt-2">
                  <Link href="/contact-us" className="block px-6 py-3 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold" onClick={closeMenus}>
                    📧 Contact Us
                  </Link>
                </div>

                <div className="border-t border-[#3a1804]/50 mt-2 pt-3 px-6">
                  <p className="text-amber-300 font-bold text-xs uppercase mb-3">Follow Us</p>
                  <div className="flex gap-4">
                    <a href="#" className="text-2xl hover:scale-110 transition">🐦</a>
                    <a href="#" className="text-2xl hover:scale-110 transition">📘</a>
                    <a href="#" className="text-2xl hover:scale-110 transition">📷</a>
                    <a href="#" className="text-2xl hover:scale-110 transition">🎬</a>
                  </div>
                </div>
              </div>
            </div>,
            shellRef.current
          )}

        {/* MAIN CONTENT — scrolls in the area above the bottom bar */}
        <main className="app-main themed-scrollbar flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {/* INTRODUCTION SECTION */}
          <section className="mx-3 mt-4 wooden-carved rounded-xl p-5 border-4 border-[#4a2005] hero-card honeycomb-pattern relative overflow-visible">
            <div className="text-center relative z-20">
              <h2 className="hero-title mb-2" style={{ fontFamily: "'Grandstander'" }}>
                Welcome to BUZZAR! 🐝
              </h2>
              <p className="text-amber-100 text-sm leading-relaxed mb-3">
                The ultimate gamified learning platform where knowledge is power and speed is everything!
              </p>
              <p className="text-amber-200 text-xs leading-relaxed">
                Join thousands of players competing in real-time quiz battles. Answer questions correctly, climb the ranks from Worker Bee to Hive Master, and dominate the leaderboards!
              </p>
            </div>
          </section>

          {/* QUICK STATS */}
          <section className="mx-3 mt-4 grid grid-cols-3 gap-2">
            <div className="wooden-carved rounded-lg p-3 text-center border-2 border-[#4a2005] stat-card">
              <p className="stat-number">2,847</p>
              <p className="stat-label">Players Online</p>
            </div>
            <div className="wooden-carved rounded-lg p-3 text-center border-2 border-[#4a2005] stat-card">
              <p className="stat-number">15.2K</p>
              <p className="stat-label">Questions</p>
            </div>
            <div className="wooden-carved rounded-lg p-3 text-center border-2 border-[#4a2005] stat-card">
              <p className="stat-number">42M</p>
              <p className="stat-label">Answers Daily</p>
            </div>
          </section>

          {/* GAME MODES SECTION */}
          <section className="mx-3 mt-6 mb-4">
            <h3 className="section-header px-2" style={{ fontFamily: "'Grandstander'" }}>
              <svg className="section-header-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15,10 23,10 17,15 19,24 12,19 5,24 7,15 1,10 9,10" />
              </svg>
              Choose Your Game Mode
            </h3>

            {/* HIVE MASTER */}
            <div className="game-card">
              <div className="hex-icon-badge">👑</div>
              <div className="game-card-content">
                <h4 className="game-card-title text-amber-300">HIVE MASTER</h4>
                <p className="game-card-desc">Solo Progression Mode</p>
              </div>
              <Link href="/hive-master/quiz" className="btn-pill game-card-action">
                PLAY
              </Link>
            </div>

            {/* HIVE ON FIRE */}
            <div className="game-card">
              <div className="hex-icon-badge">🔥</div>
              <div className="game-card-content">
                <h4 className="game-card-title text-orange-400">HIVE ON FIRE</h4>
                <p className="game-card-desc">Real-Time Multiplayer Tournament</p>
              </div>
              <button className="btn-pill">ENTER</button>
            </div>

            {/* HIVE WAR */}
            <div className="game-card">
              <div className="hex-icon-badge">⚔️</div>
              <div className="game-card-content">
                <h4 className="game-card-title text-purple-300">HIVE WAR</h4>
                <p className="game-card-desc">PvP Duel Battles (2–4 Players)</p>
              </div>
              <button className="btn-pill">DUEL</button>
            </div>
          </section>

          {/* LEADERBOARD PREVIEW */}
          <section className="mx-3 mb-6 pb-2">
            <h3 className="section-header px-2 mb-3" style={{ fontFamily: "'Grandstander'" }}>
              <svg className="section-header-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15,10 23,10 17,15 19,24 12,19 5,24 7,15 1,10 9,10" />
              </svg>
              Top Players
            </h3>
            <div className="wooden-carved rounded-lg p-3 border-2 border-[#4a2005] leaderboard-card relative">
              {[
                { rank: 1, name: 'BeeKeeper_Max', points: '12,450' },
                { rank: 2, name: 'HoneyLover92', points: '11,820' },
                { rank: 3, name: 'SwarmMaster', points: '11,200' },
              ].map((player) => (
                <div key={player.rank} className={`leaderboard-row rank-${player.rank}`}>
                  <div className={`rank-badge rank-${player.rank}`}>{player.rank}</div>
                  <span className="text-xs font-bold text-amber-100 flex-1">{player.name}</span>
                  <span className="leaderboard-score">{player.points}</span>
                </div>
              ))}
              {/* Floating Streak Bee */}
              <img
                src="/assets/bee_wink.png"
                alt="Streak Bee"
                className="leaderboard-bee"
                width={60}
                height={60}
              />
            </div>
          </section>
        </main>

        {/* BOTTOM NAV — always visible; main scrolls above it */}
        <nav className="app-bottom-nav shrink-0 w-full wooden-carved rounded-t-2xl px-0 flex justify-around items-stretch bottom-nav py-1 z-50">
          <button className="nav-tab active flex-1">
            <span className="text-2xl">🏠</span>
            <span className="nav-tab-label">Home</span>
          </button>
          <button className="nav-tab flex-1">
            <span className="text-2xl">🎮</span>
            <span className="nav-tab-label">Play</span>
          </button>
          <button className="nav-tab flex-1">
            <span className="text-2xl">🏆</span>
            <span className="nav-tab-label">Board</span>
          </button>
          <button className="nav-tab flex-1">
            <span className="text-2xl">🎓</span>
            <span className="nav-tab-label">Learn</span>
          </button>
          <button className="nav-tab flex-1">
            <span className="text-2xl">👥</span>
            <span className="nav-tab-label">Friends</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
