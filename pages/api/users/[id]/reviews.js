import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    const reviews = await prisma.rating.findMany({
      where: {
        userId: id
      },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            rawgId: true,
            coverPhoto: true
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

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
  }
}
