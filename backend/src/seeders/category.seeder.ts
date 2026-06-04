import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';

function slug(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

const SEED_DATA: Array<{
  title: string;
  subcategories?: Array<{ title: string; children?: string[] }>;
}> = [
  { title: 'General' },
  {
    title: 'Science & Nature',
    subcategories: [
      { title: 'Space & Astronomy', children: ['Solar System', 'Planets', 'Cosmology', 'The Big Bang Theory', 'Space Exploration', 'NASA History', 'Stars', 'Nebulae', 'Black Holes', 'Exoplanets', 'Astrobiology'] },
      { title: 'Animals & Wildlife', children: ['Birds', 'Ornithology', 'Marine Life', 'Oceanography', 'Mammals', 'Apex Predators', 'Insects', 'Entomology', 'Reptiles', 'Amphibians'] },
      { title: 'Human Biology & Medicine', children: ['Anatomy', 'Organ Systems', 'Genetics', 'DNA', 'Diseases', 'Viruses', 'Immunology', 'Medical Breakthroughs', 'Medical History'] },
      { title: 'Earth Sciences', children: ['Geology', 'Tectonic Plates', 'Weather', 'Climate', 'Meteorology', 'Ecosystems', 'Rainforests', 'Biomes', 'Natural Disasters', 'Environmental Phenomena'] },
      { title: 'Chemistry & Physics', children: ['The Periodic Table', 'Chemical Elements', 'Laws of Physics', 'Quantum Mechanics', 'Chemical Reactions', 'Chemical Bonding', 'Famous Scientists', 'Nobel Laureates'] },
    ],
  },
  {
    title: 'Sports & Games',
    subcategories: [
      { title: 'Football (Soccer)', children: ['FIFA World Cup History', 'FIFA World Cup Records', 'UEFA European Championship', 'CAF Africa Cup of Nations', 'Copa América', 'UEFA Champions League', 'Copa Libertadores', 'English Premier League', 'Spanish La Liga', 'Italian Serie A', 'German Bundesliga', 'French Ligue 1', 'Major League Soccer', 'Saudi Pro League', 'Brazilian Série A', 'Ballon d\'Or', 'Football Club Kits', 'Football Badges'] },
      { title: 'American & Global Sports', children: ['NBA Basketball History', 'NBA Basketball Stars', 'NFL Football History', 'Super Bowl Lore', 'MLB Baseball History', 'World Series Trivia', 'Tennis Grand Slams', 'Tennis Legends'] },
      { title: 'Motorsports', children: ['Formula 1 Teams', 'Formula 1 Drivers', 'Formula 1 Tracks', 'MotoGP', 'Le Mans Endurance Racing'] },
      { title: 'Combat Sports & Athletics', children: ['Olympic Games History', 'Boxing Legends', 'Heavyweight Bouts', 'UFC History', 'Mixed Martial Arts'] },
      { title: 'Gaming & Esports', children: ['Retro Arcade Games', '8-Bit Classics', 'League of Legends Esports', 'Valorant Esports', 'Counter-Strike Esports', 'Elden Ring Lore', 'The Legend of Zelda Lore', 'The Witcher Lore', 'Pokémon Universe', 'Nintendo Universe'] },
    ],
  },
  {
    title: 'Pop Culture & Entertainment',
    subcategories: [
      { title: 'Movies & Cinema', children: ['Marvel Cinematic Universe', 'DC Cinematic Universe', 'Oscar Winning Movies', 'Horror Cinema', 'Thriller Cinema', 'Sci-Fi Classics', 'Famous Movie Quotes', 'Famous Directors', 'Iconic Film Scores', 'Movie Soundtracks'] },
      { title: 'Television & Streaming', children: ['Game of Thrones Lore', 'Breaking Bad Lore', 'Friends Sitcom Trivia', 'The Office Sitcom Trivia', 'Reality TV Moments', 'Anime Series', 'Anime Movies', 'Manga Lore'] },
      { title: 'Music History & Trends', children: ['Modern Pop Hits', 'Billboard Hot 100', 'Classic Rock History', 'Heavy Metal Legends', 'Guitar Anthems', 'Hip-Hop History', 'Rap History', 'Electronic Dance Music', 'Iconic Music Videos', 'Famous Album Art'] },
      { title: 'Internet Culture', children: ['Meme History', 'Viral Videos', 'Twitch Streamers', 'YouTube Content Creators', 'Social Media Trends', 'Viral Hashtags'] },
    ],
  },
  {
    title: 'Geography & World Culture',
    subcategories: [
      { title: 'Countries & Nations', children: ['World Flags', 'National Heraldry', 'Capital Cities', 'Global Currencies', 'Geopolitics', 'Borders', 'Enclaves', 'Territories'] },
      { title: 'Landmarks & Topography', children: ['Ancient Wonders', 'UNESCO World Heritage Sites', 'Modern Architecture', 'Skyscrapers', 'Famous Rivers', 'Mountain Ranges', 'Deserts', 'Country Outline Identification'] },
      { title: 'Food & Drink Culture', children: ['International Cuisine', 'National Dishes', 'Wine Identification', 'Craft Beer History', 'Spirits', 'Mixology', 'Coffee Culture', 'Tea Culture', 'Spices', 'Street Food', 'Culinary History'] },
    ],
  },
  {
    title: 'History & Society',
    subcategories: [
      { title: 'Ancient Civilizations', children: ['Egyptian Pharaohs', 'Egyptian Tombs', 'Roman Empire History', 'Roman Emperors', 'Gladiator Battles', 'Greek Mythology', 'Greek Philosophers', 'Greek City States', 'Mayan Empire', 'Aztec Empire', 'Inca Empire'] },
      { title: 'Modern History & Warfare', children: ['World War I History', 'World War II History', 'The Cold War', 'The Space Race', 'Famous Revolutions', 'World Leaders', 'Monarchies', 'Royal Families'] },
      { title: 'Art & Literature', children: ['Renaissance Art', 'Master Painters', 'Shakespearean Plays', 'Classic Poetry', 'Modern Literature', 'Bestselling Novels', 'World Folklore', 'Urban Legends'] },
    ],
  },
  {
    title: 'Technology & Innovation',
    subcategories: [
      { title: 'Computers & Software', children: ['Programming Languages', 'Coding Syntax', 'Cybersecurity', 'Data Encryption', 'Famous Hacks', 'Operating Systems', 'Open Source History', 'Web Development', 'Internet Protocols'] },
      { title: 'Tech Giants & Devices', children: ['Silicon Valley History', 'Tech Founders', 'Smartphone Evolution', 'Mobile Tech', 'Consumer Electronics', 'Hardware Milestones'] },
      { title: 'The Future Zone', children: ['Artificial Intelligence Models', 'Machine Learning', 'Cryptocurrency', 'Web3 Systems', 'Blockchain Technology', 'Robotics', 'Automation', 'Quantum Computing'] },
    ],
  },
  {
    title: 'Language & Words',
    subcategories: [
      { title: 'English Language', children: ['Vocabulary', 'Etymology', 'Idioms & Phrases', 'Proverbs', 'Wordplay & Anagrams'] },
      { title: 'World Languages', children: ['Spanish', 'French', 'Mandarin Chinese', 'Arabic', 'Latin', 'Sign Languages'] },
    ],
  },
  {
    title: 'The Hive (Specialty & Wildcard)',
    subcategories: [
      { title: 'Brain Teasers & Logic', children: ['Riddles', 'Lateral Thinking Puzzles', 'Speed Math', 'Mental Arithmetic', 'Visual Cryptograms', 'Optical Illusions'] },
      { title: 'The Chaotic Mix', children: ['Guinness World Records', 'Corporate Brands', 'Slogans', 'Logos', 'Expert Level Trivia', 'Historical Anachronisms', 'Debunked Myths'] },
    ],
  },
];

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Category);

  const existing = await repo.count();
  if (existing > 0) {
    console.log(`Skipping seed — ${existing} categories already exist.`);
    await AppDataSource.destroy();
    return;
  }

  let order = 0;
  for (const master of SEED_DATA) {
    const root = repo.create({ title: master.title, slug: slug(master.title), order: order++ });
    await repo.save(root);

    if (!master.subcategories) continue;

    let subOrder = 0;
    for (const sub of master.subcategories) {
      const subEntity = repo.create({ title: sub.title, slug: slug(sub.title), order: subOrder++, parentId: root.id });
      await repo.save(subEntity);

      if (!sub.children) continue;

      let childOrder = 0;
      const children = sub.children.map(name =>
        repo.create({ title: name, slug: slug(name), order: childOrder++, parentId: subEntity.id })
      );
      await repo.save(children);
    }
  }

  console.log('Seeding complete.');
  await AppDataSource.destroy();
}

seed().catch(err => { console.error(err); process.exit(1); });
