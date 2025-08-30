import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    try {
      // First find the game in our database
      const game = await prisma.game.findFirst({
        where: {
          OR: [
            { id: id },
            { rawgId: id }
          ]
        }
      });

      if (game) {
        // Fetch all reviews for this game
        const reviews = await prisma.rating.findMany({
          where: {
            gameId: game.id
          },
          include: {
            user: {
              select: {
                username: true,
                id: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        return res.status(200).json({
          reviews: reviews
        });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    // If database is not available or game not found, return empty reviews
    res.status(200).json({
      reviews: []
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
  }
}
