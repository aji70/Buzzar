/**
 * Asset paths extracted from the BUZZQUIZ UI kit (bee1.png / public/assets).
 * Source sheet: /bee1.png (1536×1024) — see scripts/extract-ui-kit-assets.py to re-crop.
 */
export const ASSETS = {
  logo: '/assets/logo_buzzquiz.png',
  bees: {
    happy: '/assets/bee_happy_bucket.png',
    sad: '/assets/bee_sad.png',
    cool: '/assets/bee_cool_sunglasses.png',
    wink: '/assets/bee_wink.png',
    silhouette: '/assets/bee_silhouette_sm.png',
  },
  nav: {
    home: '/assets/nav_btn_home.png',
    play: '/assets/nav_btn_play.png',
    leaderboard: '/assets/nav_btn_leaderboard.png',
    profile: '/assets/nav_btn_profile.png',
    shop: '/assets/nav_btn_shop.png',
    settings: '/assets/nav_btn_settings.png',
  },
  hex: {
    default: '/assets/hex_btn_default.png',
    amber: '/assets/hex_btn_amber.png',
    green: '/assets/hex_btn_green.png',
    red: '/assets/hex_btn_red.png',
    wood1: '/assets/hex_wood_1.png',
    woodRed: '/assets/hex_wood_red.png',
    woodGreen: '/assets/hex_wood_green.png',
  },
  trophies: {
    gold: '/assets/trophy_hex_gold_full.png',
    honey: '/assets/trophy_hex_honey1.png',
  },
  panels: {
    categories: '/assets/panel_categories.png',
    hiveSize: '/assets/panel_hive_size.png',
  },
  progress: {
    honeycomb: '/assets/progressbar_honeycomb.png',
    wax: '/assets/progressbar_wax.png',
  },
  effects: {
    sparkles: '/assets/effect_sparkles.png',
    goldenRing: '/assets/effect_golden_ring.png',
  },
  banners: {
    reward: '/assets/banner_reward_full.png',
  },
} as const;

export const BOTTOM_NAV = [
  { id: 'home', label: 'Home', icon: ASSETS.nav.home },
  { id: 'play', label: 'Play', icon: ASSETS.nav.play },
  { id: 'board', label: 'Board', icon: ASSETS.nav.leaderboard },
  { id: 'learn', label: 'Learn', icon: ASSETS.nav.shop },
  { id: 'friends', label: 'Friends', icon: ASSETS.nav.profile },
] as const;

export const GAME_MODES = [
  {
    id: 'hive-master',
    title: 'HIVE MASTER',
    titleClass: 'text-amber-300',
    desc: 'Solo Progression Mode',
    icon: ASSETS.trophies.gold,
    cta: 'PLAY',
    hexBtn: ASSETS.hex.amber,
  },
  {
    id: 'hive-fire',
    title: 'HIVE ON FIRE',
    titleClass: 'text-orange-400',
    desc: 'Real-Time Multiplayer Tournament',
    icon: ASSETS.hex.woodRed,
    cta: 'ENTER',
    hexBtn: ASSETS.hex.amber,
  },
  {
    id: 'hive-war',
    title: 'HIVE WAR',
    titleClass: 'text-purple-300',
    desc: 'PvP Duel Battles (2–4 Players)',
    icon: ASSETS.hex.woodGreen,
    cta: 'DUEL',
    hexBtn: ASSETS.hex.red,
  },
] as const;
