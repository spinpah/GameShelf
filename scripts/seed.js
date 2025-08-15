// scripts/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleGames = [
  {
    name: "The Legend of Zelda: Breath of the Wild",
    description: "An open-world action-adventure game that takes place at the end of the Zelda timeline. Link awakens from a 100-year slumber to defeat Calamity Ganon and save Hyrule.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1nqv.jpg",
    averageRating: 4.8
  },
  {
    name: "God of War (2018)",
    description: "Kratos and his son Atreus embark on a journey through Norse mythology. A deeply personal story about a father and son relationship set in a beautiful, brutal world.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg",
    averageRating: 4.7
  },
  {
    name: "Red Dead Redemption 2",
    description: "An epic tale of life in America's unforgiving heartland. The game's vast and atmospheric world provides the foundation for a brand new online multiplayer experience.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg",
    averageRating: 4.6
  },
  {
    name: "The Witcher 3: Wild Hunt",
    description: "A story-driven open world RPG set in a dark fantasy universe. Play as Geralt of Rivia, a monster hunter tasked with finding a child of prophecy.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2wtq.jpg",
    averageRating: 4.8
  },
  {
    name: "Hades",
    description: "A rogue-like dungeon crawler from the creators of Bastion and Transistor. Defy the god of death as you hack and slash out of the Underworld.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2i5d.jpg",
    averageRating: 4.5
  },
  {
    name: "Cyberpunk 2077",
    description: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rwb.jpg",
    averageRating: 3.8
  },
  {
    name: "Minecraft",
    description: "A sandbox video game where players can build constructions out of textured cubes in a 3D procedurally generated world.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co49xz.jpg",
    averageRating: 4.4
  },
  {
    name: "Elden Ring",
    description: "A fantasy action-RPG adventure set within a world full of mystery and peril. Journey through the Lands Between and become the Elden Lord.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
    averageRating: 4.7
  },
  {
    name: "Among Us",
    description: "A multiplayer game of teamwork and betrayal. Crewmates work together to complete tasks while trying to identify the Impostors among them.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2etn.jpg",
    averageRating: 4.1
  },
  {
    name: "Grand Theft Auto V",
    description: "An action-adventure game set in the fictional state of San Andreas. Switch between three unique protagonists and explore Los Santos.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
    averageRating: 4.5
  },
  {
    name: "Animal Crossing: New Horizons",
    description: "Create your own island paradise in this relaxing simulation game. Customize everything from your character to your home and the island itself.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1my5.jpg",
    averageRating: 4.3
  },
  {
    name: "Spider-Man: Miles Morales",
    description: "Experience the rise of Miles Morales as he masters new powers to become his own Spider-Man in this standalone adventure.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ict.jpg",
    averageRating: 4.4
  },
  {
    name: "Valorant",
    description: "A free-to-play multiplayer tactical first-person shooter. Blend your style and experience on a global, competitive stage.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mv0.jpg",
    averageRating: 4.2
  },
  {
    name: "Fortnite",
    description: "A free-to-play battle royale game where 100 players fight to be the last one standing. Build, explore, and survive in this ever-changing world.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co20g4.jpg",
    averageRating: 4.0
  },
  {
    name: "Fall Guys",
    description: "A massively multiplayer party game with up to 60 players online in a free-for-all struggle through round after round of escalating chaos.",
    coverPhoto: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2eua.jpg",
    averageRating: 3.9
  }
];

async function seedGames() {
  console.log('🌱 Starting to seed the database...');

  try {
    // Clear existing data (optional - be careful in production)
    console.log('🗑️  Clearing existing ratings and games...');
    await prisma.rating.deleteMany();
    await prisma.game.deleteMany();
    
    console.log('🎮 Adding games to database...');
    
    // Add games one by one
    for (const game of sampleGames) {
      const createdGame = await prisma.game.create({
        data: game
      });
      console.log(`✅ Added: ${createdGame.name}`);
    }
    
    console.log(`\n🎉 Successfully seeded database with ${sampleGames.length} games!`);
    console.log('🚀 Your GameShelf is ready to use!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedGames();
}

module.exports = seedGames;