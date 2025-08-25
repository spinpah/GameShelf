
// pages/api/games/index.js
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify authentication
 
    try {
      const games = await prisma.game.findMany({
        orderBy: {
          averageRating: 'desc'
        },
        take: 20
      });

      res.status(200).json({
        games,
        total: games.length
      });
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  ;
}