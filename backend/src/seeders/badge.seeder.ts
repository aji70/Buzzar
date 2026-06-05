import { AppDataSource } from '../config/database';
import { Badge } from '../entities/Badge';

const BADGES: Omit<Badge, 'id' | 'createdAt'>[] = [
  {
    key: 'first_game',
    name: 'Fresh Recruit',
    title: '🐝 Fresh Recruit',
    icon: '🐝',
    rarity: 'common',
    body: 'Completed your first Hive Master game. Every queen started as a worker!',
    benefits: ['Access to Hive Master history stats'],
  },
  {
    key: 'first_win',
    name: 'First Sting',
    title: '🏅 First Sting',
    icon: '🏅',
    rarity: 'common',
    body: 'Won your first Hive Master game. The hive felt your sting!',
    benefits: ['Animated win banner in profile'],
  },
  {
    key: 'wins_5',
    name: 'Honey Collector',
    title: '🍯 Honey Collector',
    icon: '🍯',
    rarity: 'rare',
    body: 'Achieved 5 Hive Master victories. Sweet success.',
    benefits: ['Gold border on leaderboard', 'Exclusive "Honey" profile theme'],
  },
  {
    key: 'wins_25',
    name: 'Guard Bee',
    title: '🛡️ Guard Bee',
    icon: '🛡️',
    rarity: 'rare',
    body: 'Defended the hive 25 times. A seasoned protector.',
    benefits: ['Silver ELO badge on profile', 'Priority matchmaking queue'],
  },
  {
    key: 'wins_100',
    name: "Queen's Champion",
    title: "👑 Queen's Champion",
    icon: '👑',
    rarity: 'legendary',
    body: "A century of victories. The queen herself bows to your mastery.",
    benefits: [
      'Exclusive golden crown frame',
      "\"Queen's Champion\" title on all games",
      'Early access to new game modes',
      'Custom hexagon badge colour',
    ],
  },
  {
    key: 'elo_1200',
    name: 'Scout Bee',
    title: '🔍 Scout Bee',
    icon: '🔍',
    rarity: 'common',
    body: 'Reached ELO 1200. Your knowledge of the hive grows.',
    benefits: ['Scout badge visible on leaderboard'],
  },
  {
    key: 'elo_1500',
    name: 'Elite Drone',
    title: '⚡ Elite Drone',
    icon: '⚡',
    rarity: 'rare',
    body: 'Cracked ELO 1500. Flying higher than most.',
    benefits: ['Electric outline on avatar', 'Streak bonus +5% in Hive Master'],
  },
  {
    key: 'elo_2000',
    name: 'Hive God',
    title: '🌟 Hive God',
    icon: '🌟',
    rarity: 'legendary',
    body: 'ELO 2000 achieved. You are the hive.',
    benefits: [
      'Legendary "Hive God" title across all modes',
      'Gold animated hexagon frame',
      'Exclusive Hive God leaderboard tier',
      '+10% point multiplier in all solo modes',
    ],
  },
  {
    key: 'games_10',
    name: 'Busy Bee',
    title: '🌸 Busy Bee',
    icon: '🌸',
    rarity: 'common',
    body: 'Played 10 Hive Master games. Never stop buzzing.',
    benefits: ['Flower trail on profile'],
  },
  {
    key: 'games_50',
    name: 'Veteran Forager',
    title: '🌿 Veteran Forager',
    icon: '🌿',
    rarity: 'epic',
    body: 'Played 50 Hive Master games. The fields know your wings.',
    benefits: ['Epic green hexagon border', 'Veteran badge on leaderboard', 'Unlock Hive Master replay stats'],
  },
];

export async function seedBadges() {
  const repo = AppDataSource.getRepository(Badge);

  for (const data of BADGES) {
    const existing = await repo.findOne({ where: { key: data.key } });
    if (!existing) {
      await repo.save(repo.create(data));
      console.log(`  ✔ Badge seeded: ${data.key}`);
    }
  }

  console.log('Badge seeding complete.');
}
