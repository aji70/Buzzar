'use client';

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

type MenuPosition = { top: number; right: number };

const MENU_BACKDROP_Z = 9998;
const MENU_PANEL_Z = 9999;

function getMenuPosition(trigger: HTMLElement | null, menuWidth: number): MenuPosition | null {
  if (!trigger) return null;
  const rect = trigger.getBoundingClientRect();
  const margin = 8;
  let right = window.innerWidth - rect.right;
  const maxRight = window.innerWidth - menuWidth - margin;
  if (right > maxRight) right = maxRight;
  if (right < margin) right = margin;
  return {
    top: rect.bottom + margin,
    right,
  };
}

export default function Home() {
  const [soundOn, setSoundOn] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [menuLayoutTick, setMenuLayoutTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  const userTriggerRef = useRef<HTMLButtonElement>(null);
  const mainTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMenus = useCallback(() => {
    setShowUserMenu(false);
    setShowMainMenu(false);
  }, []);

  // Re-measure menu position after open and on scroll/resize
  useLayoutEffect(() => {
    if (!showUserMenu && !showMainMenu) return;
    setMenuLayoutTick((t) => t + 1);
    const handleReposition = () => setMenuLayoutTick((t) => t + 1);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [showUserMenu, showMainMenu]);

  // menuLayoutTick forces a re-render after mount so position uses fresh layout
  const userMenuPosition =
    showUserMenu && menuLayoutTick >= 0
      ? getMenuPosition(userTriggerRef.current, 200)
      : null;
  const mainMenuPosition =
    showMainMenu && menuLayoutTick >= 0
      ? getMenuPosition(mainTriggerRef.current, 220)
      : null;

  return (
    <div className="min-h-dvh w-full flex justify-center bg-gradient-to-b from-[#2a1810] via-[#1a1008] to-[#0f0905]">
      <div className="app-shell mx-auto w-full max-w-[560px] flex flex-col bg-gradient-to-b from-[#2a1810] via-[#1a1008] to-[#0f0905]">
        {/* HEADER */}
        <header className="header-nav rounded-b-2xl mx-2 mt-2 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
          {/* Logo & Mascot */}
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-float">🐝</span>
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
              ref={userTriggerRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (showUserMenu) {
                  setShowUserMenu(false);
                } else {
                  setShowUserMenu(true);
                  setShowMainMenu(false);
                }
              }}
              className="p-2 hover:scale-110 transition-transform text-2xl"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              👤
            </button>

            {/* Main Menu Button */}
            <button
              ref={mainTriggerRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (showMainMenu) {
                  setShowMainMenu(false);
                } else {
                  setShowMainMenu(true);
                  setShowUserMenu(false);
                }
              }}
              className="p-2 hover:scale-110 transition-transform text-2xl"
              aria-expanded={showMainMenu}
              aria-haspopup="true"
            >
              ☰
            </button>
          </div>
        </header>

        {mounted &&
          (showUserMenu || showMainMenu) &&
          createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/40"
                style={{ zIndex: MENU_BACKDROP_Z }}
                onClick={closeMenus}
                aria-hidden="true"
              />
              {showUserMenu && userMenuPosition && (
                <div
                  className="wooden-carved rounded-lg shadow-2xl border-2 border-amber-600 min-w-[200px] max-w-[min(280px,calc(100vw-16px))]"
                  style={{
                    position: 'fixed',
                    top: userMenuPosition.top,
                    right: userMenuPosition.right,
                    zIndex: MENU_PANEL_Z,
                  }}
                  role="menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative z-10 p-4 border-b border-amber-700">
                    <p className="text-amber-300 font-bold text-sm">Guest User</p>
                    <p className="text-amber-100 text-xs">Player ID: #12345</p>
                  </div>
                  <button type="button" className="relative z-10 w-full text-left px-4 py-3 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold border-b border-amber-700">
                    📊 My Stats
                  </button>
                  <button type="button" className="relative z-10 w-full text-left px-4 py-3 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold border-b border-amber-700">
                    🎮 My Games
                  </button>
                  <button type="button" className="relative z-10 w-full text-left px-4 py-3 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold border-b border-amber-700">
                    ⚙️ Settings
                  </button>
                  <button type="button" className="relative z-10 w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 transition text-sm font-semibold">
                    🚪 Logout
                  </button>
                </div>
              )}
              {showMainMenu && mainMenuPosition && (
                <div
                  className="wooden-carved rounded-lg shadow-2xl border-2 border-amber-600 min-w-[220px] max-w-[min(300px,calc(100vw-16px))]"
                  style={{
                    position: 'fixed',
                    top: mainMenuPosition.top,
                    right: mainMenuPosition.right,
                    zIndex: MENU_PANEL_Z,
                  }}
                  role="menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative z-10 p-3 border-b border-amber-700 bg-amber-900/30">
                    <p className="text-amber-300 font-bold text-sm">BUZZAR</p>
                    <p className="text-amber-100 text-xs">Where Knowledge Creates a Buzz</p>
                  </div>

                  <div className="relative z-10 p-2 border-b border-amber-700">
                    <p className="text-amber-300 font-bold text-xs uppercase px-2 py-1 mb-1">Legal</p>
                    <Link href="/disclaimer" className="block px-4 py-2 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold rounded" onClick={closeMenus}>
                      📋 Disclaimer
                    </Link>
                    <Link href="/privacy-policy" className="block px-4 py-2 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold rounded" onClick={closeMenus}>
                      🔐 Privacy Policy
                    </Link>
                    <Link href="/terms-and-conditions" className="block px-4 py-2 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold rounded" onClick={closeMenus}>
                      ✅ Terms & Conditions
                    </Link>
                  </div>

                  <div className="relative z-10 p-2 border-b border-amber-700">
                    <Link href="/contact-us" className="block px-4 py-2 text-amber-100 hover:bg-amber-900/20 transition text-sm font-semibold rounded" onClick={closeMenus}>
                      📧 Contact Us
                    </Link>
                  </div>

                  <div className="relative z-10 p-3">
                    <p className="text-amber-300 font-bold text-xs uppercase px-2 mb-2">Follow Us</p>
                    <div className="flex gap-2 px-2">
                      <a href="#" className="text-2xl hover:scale-110 transition">🐦</a>
                      <a href="#" className="text-2xl hover:scale-110 transition">📘</a>
                      <a href="#" className="text-2xl hover:scale-110 transition">📷</a>
                      <a href="#" className="text-2xl hover:scale-110 transition">🎬</a>
                    </div>
                  </div>
                </div>
              )}
            </>,
            document.body
          )}

        {/* MAIN CONTENT — scrolls in the area above the bottom bar */}
        <main className="app-main themed-scrollbar flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {/* INTRODUCTION SECTION */}
          <section className="mx-3 mt-4 wooden-carved rounded-xl p-5 border-4 border-orange-600 hero-card honeycomb-pattern relative overflow-visible">
            <div className="text-center relative z-20">
              <h2 className="hero-title mb-2" style={{ fontFamily: "'Fredoka One'" }}>
                Welcome to BUZZAR! 🐝
              </h2>
              <p className="text-amber-100 text-sm leading-relaxed mb-3">
                The ultimate gamified learning platform where knowledge is power and speed is everything!
              </p>
              <p className="text-amber-200 text-xs leading-relaxed">
                Join thousands of players competing in real-time quiz battles. Answer questions correctly, climb the ranks from Worker Bee to Hive Master, and dominate the leaderboards!
              </p>
            </div>
            {/* Floating Bee */}
            <img
              src="/assets/bee_happy_bucket.png"
              alt="Happy Bee"
              className="hero-bee"
              width={110}
              height={110}
            />
          </section>

          {/* QUICK STATS */}
          <section className="mx-3 mt-4 grid grid-cols-3 gap-2">
            <div className="wooden-carved rounded-lg p-3 text-center border-2 border-amber-600 stat-card">
              <p className="stat-number">2,847</p>
              <p className="stat-label">Players Online</p>
            </div>
            <div className="wooden-carved rounded-lg p-3 text-center border-2 border-amber-600 stat-card">
              <p className="stat-number">15.2K</p>
              <p className="stat-label">Questions</p>
            </div>
            <div className="wooden-carved rounded-lg p-3 text-center border-2 border-amber-600 stat-card">
              <p className="stat-number">42M</p>
              <p className="stat-label">Answers Daily</p>
            </div>
          </section>

          {/* GAME MODES SECTION */}
          <section className="mx-3 mt-6 mb-4">
            <h3 className="section-header px-2" style={{ fontFamily: "'Fredoka One'" }}>
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
              <button className="btn-pill">PLAY</button>
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
            <h3 className="section-header px-2 mb-3" style={{ fontFamily: "'Fredoka One'" }}>
              <svg className="section-header-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15,10 23,10 17,15 19,24 12,19 5,24 7,15 1,10 9,10" />
              </svg>
              Top Players
            </h3>
            <div className="wooden-carved rounded-lg p-3 border-2 border-amber-600 leaderboard-card relative">
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
