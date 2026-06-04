# 🐝 BUZZAR SVG ASSETS — QUICK REFERENCE

## File Structure
```
/public/svg/
├── buzzar-assets.svg              ← Master library (all assets demo)
├── hexagon-base.svg               ← Base hexagon shape
├── hexagon-buttons.svg            ← Button states (A, B, ✓, ✕)
├── nav-icons.svg                  ← Navigation icons (6 icons)
├── honeycomb-cells.svg            ← Progress cells (0-100% fill)
├── decorative-elements.svg        ← Leaves, flowers, vines
└── patterns-gradients.svg         ← Gradients & patterns
```

---

## 🟡 Hexagon Button States

### Default State
```
Colors: Brown gradient (#8b5a3c → #4a2f1a)
Border: #4a2815 (3px)
Shadow: Default
Text: Amber (#f59e0b)
Example: Letter "A"
```

### Hover State
```
Colors: Amber gradient (#f59e0b → #b45309)
Border: #d97706 (3px)
Shadow: Glow effect (amber)
Text: White
Example: Letter "B"
```

### Correct State (Green)
```
Colors: Green gradient (#10b981 → #047857)
Border: #059669 (3px)
Shadow: Glow effect (green)
Symbol: ✓ (checkmark)
```

### Wrong State (Red)
```
Colors: Red gradient (#dc2626 → #7f1d1d)
Border: #b91c1c (3px)
Shadow: Glow effect (red)
Symbol: ✕ (X)
```

---

## 🗺️ Navigation Icons

| Icon | ID | Used For |
|------|----|---------  |
| 🏠 | `nav-icon-home` | Home page |
| ▶️ | `nav-icon-play` | Play/Start |
| 👤 | `nav-icon-profile` | User profile |
| 🛍️ | `nav-icon-shop` | Shop/Store |
| 📊 | `nav-icon-leaderboard` | Rankings |
| ⚙️ | `nav-icon-settings` | Settings |
| ☰ | (position 7) | Menu |
| ✕ | (position 8) | Close |

**Size:** 32×32px (scale as needed)  
**Color:** `#f59e0b` (amber) — changeable via CSS

---

## 🍯 Honeycomb Progress Cells

| Fill % | Color | Usage |
|--------|-------|-------|
| 0% | Empty (outline only) | Unfilled cells |
| 25% | Amber with shine | Light progress |
| 50% | Amber with shine | Mid progress |
| 75% | Amber with shine | Most progress |
| 100% | Amber + glow | Complete |

**Size:** 120×120px (can scale)  
**Use in:** Progress bars, experience trackers, rank progression

---

## 🌿 Decorative Elements

### Leaves
- **6 rotation variants:** 0°, 45°, 90°, 135°, 180°, 270°
- **Color:** Sage green (#10b981)
- **Uses:** Panel corners, borders, accent elements

### Flowers
- **Single:** 1 center + 6 petals
- **Pair:** 2 flowers side-by-side
- **Cluster:** 5-flower arrangement
- **Color:** Gold (#f59e0b) center, amber petals
- **Uses:** Decorative accents, achievement markers

### Vines
- **Single vine:** Curved path, reusable
- **With leaves:** Vine + leaf attachments
- **Corner element:** Vine + flower combo
- **Color:** Sage green (#10b981)
- **Uses:** Panel borders, ornamental frames

---

## 🎨 Gradients (in patterns-gradients.svg)

### Radial Glows
```
gradient-amber-glow      → Soft amber halo
gradient-gold-glow       → Intense gold halo
gradient-green-glow      → Soft green halo
gradient-red-glow        → Soft red halo
```

### Linear Gradients
```
gradient-hex-default     → Brown hexagon
gradient-hex-hover       → Amber hexagon
gradient-hex-correct     → Green hexagon
gradient-hex-wrong       → Red hexagon
gradient-honey-liquid    → Amber liquid effect
```

### Patterns
```
wood-grain-light         → Light wood texture (tileable)
wood-grain-dark          → Dark wood texture (tileable)
honeycomb-grid           → Low-opacity hex grid
```

---

## 🔌 Quick Import Examples

### In React Component
```jsx
// SVG Image Import
import HexButtons from '@/public/svg/hexagon-buttons.svg';

// Or using next/image
import Image from 'next/image';

export default function Component() {
  return (
    <>
      {/* Direct SVG file */}
      <svg className="w-24 h-24">
        <use href="/svg/nav-icons.svg#nav-icon-home" />
      </svg>

      {/* Or as Image */}
      <Image
        src="/svg/hexagon-buttons.svg"
        alt="Buttons"
        width={500}
        height={120}
      />
    </>
  );
}
```

### In CSS (background)
```css
.wood-panel {
  background: url('/svg/patterns-gradients.svg#wood-grain-light');
  background-size: 100px 100px;
}

.glow-element {
  background: url('/svg/patterns-gradients.svg#gradient-amber-glow');
}
```

---

## 📐 Dimensions Reference

| Asset | Width | Height | Type |
|-------|-------|--------|------|
| Hexagon Button | 120 | 120 | Individual |
| Hexagon Buttons Sheet | 500 | 120 | Spritesheet |
| Nav Icon | 32 | 32 | Individual |
| Nav Icons Sheet | 384 | 96 | Spritesheet |
| Honeycomb Cell | 120 | 120 | Individual |
| Honeycomb Sheet | 480 | 120 | Spritesheet |
| Leaf | Variable | Variable | Scale freely |
| Flower | 24 | 24 | Scale freely |

**Note:** All SVG dimensions are scalable. Use `viewBox` for responsive sizing.

---

## 🎯 Color Palette Quick Reference

```
Primary:  #f59e0b  (Honey Amber)
Secondary: #d97706  (Warm Orange)

Success:  #10b981  (Sage Green)
Error:    #dc2626  (Flame Red)
Warning:  #ea580c  (Flame Orange)
Special:  #8b5cf6  (Duel Purple)

Wood Light: #8b5a3c
Wood Mid:   #6b4423
Wood Dark:  #4a2f1a
Background: #1a1008  (Deep Charcoal)
```

---

## ⚡ Common Use Cases

### Quiz/Answer Screen
```
Components needed:
- Hexagon buttons (A, B, C, D) → hexagon-buttons.svg
- Question panel background → wood-grain pattern
- Timer display → hexagon badge
- Feedback bee animation → FEEDBACK-001 (AI illustration)
```

### Progress/Leaderboard Screen
```
Components needed:
- Navigation icons → nav-icons.svg
- Progress bars → honeycomb-cells.svg
- Level badge → hexagon with gradient
- Decorative corners → decorative-elements.svg (leaves)
```

### Reward/Celebration Screen
```
Components needed:
- Hexagon progress cells → honeycomb-cells.svg
- Flower clusters → decorative-elements.svg
- Gold glow effect → gradient-gold-glow
- Bee mascot → FEEDBACK-003 or GLOBAL-005 (AI illustration)
```

---

## 🔧 CSS Utility Classes

Add these to your `globals.css`:

```css
/* Hexagon Shape */
.hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

/* Button States */
.btn-hexagon {
  @apply hexagon w-32 h-32 font-black text-4xl transition-all duration-200;
}

.btn-hexagon-default {
  @apply bg-gradient-to-br from-amber-800 to-amber-950 border-4 border-amber-900 text-amber-300 shadow-lg;
}

.btn-hexagon-default:hover {
  @apply bg-gradient-to-br from-amber-400 to-amber-600 border-amber-500 glow-amber;
}

.btn-hexagon-correct {
  @apply bg-gradient-to-br from-green-500 to-green-700 border-green-600 text-white glow-green;
}

.btn-hexagon-wrong {
  @apply bg-gradient-to-br from-red-500 to-red-700 border-red-600 text-white glow-red;
}

/* Glow Effects */
.glow-amber {
  @apply shadow-[0_0_20px_rgba(245,158,11,0.6)];
}

.glow-green {
  @apply shadow-[0_0_20px_rgba(16,185,129,0.6)];
}

.glow-red {
  @apply shadow-[0_0_20px_rgba(220,38,38,0.6)];
}

.glow-gold {
  @apply shadow-[0_0_30px_rgba(251,191,36,0.8)];
}

/* Wood Panel */
.wooden-panel {
  @apply bg-gradient-to-br from-amber-900 to-amber-950 border-4 border-amber-700 rounded-xl shadow-xl;
}
```

---

## 📋 Checklist for Developers

When implementing BUZZAR UI components:

- [ ] Import correct SVG file from `/public/svg/`
- [ ] Apply appropriate CSS classes for styling
- [ ] Use correct color variables from palette
- [ ] Test responsive scaling (mobile 560px max width)
- [ ] Verify glow effects render correctly
- [ ] Check wood grain texture alignment
- [ ] Confirm button states respond to hover/active
- [ ] Test hexagon clipping on all browsers
- [ ] Validate icon sizes match design spec (32px nav, 120px buttons)
- [ ] Add alt text for SVG images
- [ ] Optimize SVG file size (< 50KB each)

---

## 🚀 Next Steps

1. **Copy SVG files** to `/public/svg/`
2. **Reference guide** ready at `SVG_ASSETS_GUIDE.md`
3. **Implement components** using examples provided
4. **Test on mobile** (max 560px width)
5. **Gather feedback** on visual accuracy
6. **Commission AI illustrations** (8 assets needed):
   - FEEDBACK-001: Correct bee
   - FEEDBACK-002: Wrong bee
   - FEEDBACK-003: Streak bee
   - REWARD-005: Treasure chest
   - REWARD-006: Honey pot
   - GLOBAL-005: Floating bee
   - BEE-001: Avatar portrait

---

**For detailed implementation guide, see:** `SVG_ASSETS_GUIDE.md`  
**Last Updated:** June 2024  
**Version:** 1.0
