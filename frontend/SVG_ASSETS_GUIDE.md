# 🐝 BUZZAR SVG ASSETS GUIDE

## Overview

This guide covers all SVG assets created for the BUZZAR edtech game. All assets are located in `/public/svg/` and are optimized for React component usage.

---

## 📦 Asset Files

### 1. **buzzar-assets.svg** (Master Library)
Complete library containing all base assets with examples and demonstrations.

**File:** `/public/svg/buzzar-assets.svg`

Contains:
- Hexagon button states (5 variants)
- Navigation icons (6 icons)
- Decorative elements (leaves, flowers)
- Honeycomb cell examples
- Progress bar variants

### 2. **hexagon-base.svg**
Reusable base hexagon shape for all hex-based components.

```jsx
<svg src="/svg/hexagon-base.svg" alt="Hexagon" className="w-24 h-24 text-amber-500" />
```

**Use Cases:**
- Progress cells
- Button bases
- Badge backgrounds
- Trophy frames

### 3. **hexagon-buttons.svg**
Hexagon button states: default, hover, correct (green), wrong (red)

**Spritesheet Layout:** 4 buttons × 120px width

```jsx
import HexButtons from '@/public/svg/hexagon-buttons.svg';

// Usage in component:
<div className="flex gap-4">
  {['A', 'B', 'C', 'D'].map((letter) => (
    <button key={letter} className="hexagon-button">
      <span>{letter}</span>
    </button>
  ))}
</div>
```

### 4. **nav-icons.svg**
Navigation icons spritesheet: HOME, PLAY, PROFILE, SHOP, LEADERBOARD, SETTINGS, MENU, CLOSE

**Spritesheet Layout:** 8 icons × 32px each (384×96px total)

```jsx
const navItems = [
  { icon: 'home', label: 'Home' },
  { icon: 'play', label: 'Play' },
  { icon: 'profile', label: 'Profile' },
  { icon: 'shop', label: 'Shop' },
  { icon: 'leaderboard', label: 'Leaderboard' },
  { icon: 'settings', label: 'Settings' },
];

// Usage:
<nav className="flex gap-4">
  {navItems.map((item) => (
    <button key={item.icon} className="nav-icon-btn">
      <svg className="w-8 h-8">
        <use href={`/svg/nav-icons.svg#nav-icon-${item.icon}`} />
      </svg>
      <span className="text-xs">{item.label}</span>
    </button>
  ))}
</nav>
```

### 5. **honeycomb-cells.svg**
Progress cells with 5 fill states: 0%, 25%, 50%, 75%, 100%

**Use Cases:**
- Progress bars (level, experience, rank)
- Trophy progression
- Achievement tracking

```jsx
// Example: Progress bar with honeycomb cells
const ProgressBar = ({ current, total }) => {
  const fillPercentage = (current / total) * 100;
  const cellCount = 10;
  
  return (
    <div className="flex gap-1">
      {Array.from({ length: cellCount }).map((_, i) => {
        const cellFill = Math.min(100, Math.max(0, fillPercentage - (i * 10)));
        return (
          <svg key={i} className="w-10 h-10" viewBox="0 0 120 120">
            <polygon
              points="60,10 100,35 100,85 60,110 20,85 20,35"
              fill={cellFill > 0 ? '#f59e0b' : 'none'}
              stroke={cellFill > 0 ? '#d97706' : '#8b5a3c'}
              strokeWidth="2"
              opacity={cellFill / 100}
            />
          </svg>
        );
      })}
    </div>
  );
};
```

### 6. **decorative-elements.svg**
Leaves, flowers, and vine decorations in various rotations.

**Variants:**
- Leaf: 6 rotation angles (0°, 45°, 90°, 135°, 180°, 270°)
- Flowers: Single, pairs, clusters
- Vines: Single, with leaves, corner elements

```jsx
// Corner decoration
<div className="relative w-32 h-32">
  <svg className="absolute top-0 left-0 w-8 h-8">
    <use href="/svg/decorative-elements.svg#leaf-shape" />
  </svg>
  <svg className="absolute top-0 right-0 w-8 h-8" style={{ transform: 'rotate(90deg)' }}>
    <use href="/svg/decorative-elements.svg#leaf-shape" />
  </svg>
</div>
```

### 7. **patterns-gradients.svg**
Master file containing all reusable patterns and gradients.

**Patterns:**
- `wood-grain-light` — Light wood texture
- `wood-grain-dark` — Dark wood texture
- `honeycomb-grid` — Low-opacity honeycomb grid

**Gradients:**
- `gradient-amber-glow` — Amber radial glow
- `gradient-gold-glow` — Gold radial glow (stronger)
- `gradient-green-glow` — Green radial glow
- `gradient-red-glow` — Red radial glow
- `gradient-honey-liquid` — Honey liquid effect
- `gradient-hex-default` — Hexagon default state
- `gradient-hex-hover` — Hexagon hover state
- `gradient-hex-correct` — Hexagon correct state
- `gradient-hex-wrong` — Hexagon wrong state

**Filters:**
- `filter-drop-shadow-default` — Standard drop shadow
- `filter-drop-shadow-deep` — Deep drop shadow
- `filter-glow-amber` — Amber glow effect
- `filter-glow-green` — Green glow effect
- `filter-glow-red` — Red glow effect
- `filter-glow-gold` — Gold glow effect

---

## 🎨 CSS Classes & Utilities

### Hexagon Shape (CSS-based)
```css
.hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.hexagon-default {
  background: linear-gradient(135deg, #8b5a3c 0%, #6b4423 50%, #4a2f1a 100%);
  border: 3px solid #4a2815;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.hexagon-hover {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
  border: 3px solid #d97706;
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.7);
}

.hexagon-correct {
  background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
  border: 3px solid #059669;
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.8);
}

.hexagon-wrong {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #7f1d1d 100%);
  border: 3px solid #b91c1c;
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.8);
}
```

### Wood Grain Texture
```css
.wood-texture {
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(139, 90, 60, 0.03) 2px,
    rgba(139, 90, 60, 0.03) 4px
  ),
  linear-gradient(180deg, #8b5a3c 0%, #6b4423 50%, #4a2f1a 100%);
}
```

### Amber Glow Effect
```css
.glow-amber {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.6);
}

.glow-amber-intense {
  box-shadow:
    0 0 20px rgba(245, 158, 11, 0.8),
    0 0 40px rgba(245, 158, 11, 0.4),
    inset 0 0 20px rgba(255, 191, 36, 0.2);
}
```

---

## 🔧 Implementation Examples

### Example 1: Answer Button Component
```jsx
'use client';

import { useState } from 'react';

export default function HexagonButton({ letter, onClick, state = 'default' }) {
  const stateClass = {
    default: 'hexagon-default',
    hover: 'hexagon-hover',
    correct: 'hexagon-correct',
    wrong: 'hexagon-wrong',
  }[state];

  return (
    <button
      onClick={onClick}
      className={`hexagon w-32 h-32 flex items-center justify-center text-4xl font-black text-amber-300 transition-all duration-200 ${stateClass}`}
    >
      {letter}
    </button>
  );
}
```

### Example 2: Progress Bar Component
```jsx
'use client';

export default function ProgressBar({ current, total, label = 'PROGRESS' }) {
  const percentage = (current / total) * 100;
  const cells = 10;

  return (
    <div className="wooden-carved rounded-lg p-4 border-2 border-amber-600">
      <p className="text-xs font-black text-amber-300 mb-3 uppercase">{label}</p>
      <div className="flex justify-between gap-1">
        {Array.from({ length: cells }).map((_, i) => {
          const isFilled = (i + 1) / cells * 100 <= percentage;
          return (
            <div
              key={i}
              className={`hexagon flex-1 transition-all duration-300 ${
                isFilled
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 animate-pulse-glow'
                  : 'bg-gradient-to-br from-amber-900/40 to-amber-950/60'
              }`}
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            />
          );
        })}
      </div>
      <p className="text-xs text-amber-100 mt-2 text-right">{current}/{total}</p>
    </div>
  );
}
```

### Example 3: Navigation Component
```jsx
'use client';

export default function BottomNav() {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'play', icon: '🎮', label: 'Play' },
    { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' },
    { id: 'learn', icon: '🎓', label: 'Learn' },
    { id: 'friends', icon: '👥', label: 'Friends' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[560px] wooden-carved rounded-t-2xl flex justify-around items-center border-t-4 border-orange-600 py-2">
      {navItems.map((item) => (
        <button key={item.id} className="flex flex-col items-center gap-1 p-2 hover:scale-110 transition-transform">
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs font-bold text-amber-300">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
```

---

## 🎯 Color Reference

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Honey Amber | `#f59e0b` | 245, 158, 11 | Primary accent, buttons |
| Warm Orange | `#d97706` | 217, 119, 6 | Hover states, borders |
| Deep Charcoal | `#1a1008` | 26, 16, 8 | Background |
| Wood Light | `#8b5a3c` | 139, 90, 60 | Panel fill |
| Wood Mid | `#6b4423` | 107, 68, 35 | Panel gradient |
| Wood Dark | `#4a2f1a` | 74, 47, 26 | Shadows |
| Sage Green | `#10b981` | 16, 185, 129 | Success states |
| Flame Red | `#dc2626` | 220, 38, 38 | Error states |
| Flame Orange | `#ea580c` | 234, 88, 12 | Warning states |
| Duel Purple | `#8b5cf6` | 139, 92, 246 | PvP mode |

---

## 📊 Spritesheet Information

### Hexagon Buttons Spritesheet
- **File:** `/public/svg/hexagon-buttons.svg`
- **Dimensions:** 500×120px
- **Frame Count:** 4 states
- **Frame Size:** 120×120px each

### Navigation Icons Spritesheet
- **File:** `/public/svg/nav-icons.svg`
- **Dimensions:** 384×96px
- **Frame Count:** 8 icons
- **Frame Size:** 32×32px each (when scaled)

### Honeycomb Cells Spritesheet
- **File:** `/public/svg/honeycomb-cells.svg`
- **Dimensions:** 480×120px
- **Frame Count:** 5 states (0%, 25%, 50%, 75%, 100%)
- **Frame Size:** 120×120px each

---

## 🚀 Performance Tips

1. **Inline small SVGs** for frequently used elements (< 5KB)
2. **Use SVG sprites** for icon sets to reduce HTTP requests
3. **Apply CSS transforms** instead of re-exporting SVG variants
4. **Use `currentColor`** in SVG strokes for theme-aware icons
5. **Optimize with SVGO** before production deployment

---

## 🔄 Updating Assets

To update an SVG asset:

1. Edit the file in `/public/svg/`
2. Test rendering in React component
3. Verify CSS variables match color scheme
4. Update this guide if adding new gradients/patterns
5. Commit with clear message: `refactor: update [asset-name] SVG`

---

## 📝 Asset ID Reference

| ID | Asset | File |
|---|---|---|
| GLOBAL-001 | Hexagon Base Shape | hexagon-base.svg |
| GLOBAL-002 | Wood Grain Texture | patterns-gradients.svg |
| GLOBAL-003 | Amber Glow Halo | patterns-gradients.svg |
| GLOBAL-004 | Leaf Decoration | decorative-elements.svg |
| HEX-001 to HEX-005 | Button States | hexagon-buttons.svg |
| NAV-001 to NAV-006 | Navigation Icons | nav-icons.svg |
| PROGRESS-001 to PROGRESS-004 | Progress Cells | honeycomb-cells.svg |

---

**Last Updated:** June 2024  
**Version:** 1.0  
**Status:** Ready for production use
