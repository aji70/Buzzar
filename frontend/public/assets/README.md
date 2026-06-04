# 🐝 Buzzar Assets Directory

This directory contains image assets used in the Buzzar landing page.

## Required Assets

Place the following PNG files in this directory:

### 1. **bee_correct.png**
- **Size:** Recommended 200×200px (will display at 110px height)
- **Description:** Happy bee with bucket and honey, golden glow
- **Usage:** Hero section (floating animation), floating decorative element
- **Transparency:** Required (PNG with alpha channel)

### 2. **bee_wrong.png**
- **Size:** Recommended 200×200px
- **Description:** Sad bee with dark storm effects
- **Usage:** Feedback animations (currently unused on landing, prepared for future use)
- **Transparency:** Required (PNG with alpha channel)

### 3. **bee_streak.png**
- **Size:** Recommended 120×120px (will display at 40px height)
- **Description:** Cool bee with sunglasses and golden aura, streak bonus effect
- **Usage:** Leaderboard decorative element (top-right floating)
- **Transparency:** Required (PNG with alpha channel)

## Image Specifications

All images should:
- ✅ Be PNG format with transparency (32-bit PNG)
- ✅ Have clean, isolated subjects (no background)
- ✅ Use web-friendly dimensions (512×512px max)
- ✅ Be optimized for web (< 100KB each)
- ✅ Match the Buzzar art style (cute, gamified, 3D-rendered bee characters)

## How to Add Assets

1. Export or download your bee illustrations as PNG files
2. Rename them to match the filenames above
3. Place them in this `/public/assets/` directory
4. Restart the Next.js dev server (`npm run dev`)
5. The images will automatically appear on the landing page

## Integration Points

### Hero Section
- **File:** `bee_correct.png`
- **Location:** `/app/page.tsx` (line: "Welcome to BUZZAR" section)
- **Styling:** `hero-bee` class with float animation
- **Display:** 110px height, bottom-right corner, animated floating

### Leaderboard Section
- **File:** `bee_streak.png`
- **Location:** `/app/page.tsx` (line: "Top Players" section)
- **Styling:** `leaderboard-bee` class
- **Display:** 40px height, top-right corner, decorative

## Current Status

⚠️ **Assets are referenced in the code but not yet placed in this directory.**

To complete the visual upgrade:
1. Place the three bee PNG files here
2. Verify they display correctly at 2x browser zoom
3. Test on mobile (560px viewport width)

## Attribution

If using AI-generated images (Midjourney, Stable Diffusion, etc.):
- Store generation prompts for future reference
- Document the source in your project credits
- Ensure license allows for commercial/educational use
