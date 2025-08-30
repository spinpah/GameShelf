import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const userId = req.headers['user-id']; // We'll get this from the frontend

    try {
      // First try to find the game in our database
      let game = await prisma.game.findFirst({
        where: {
          OR: [
            { id: id },
            { rawgId: id }
          ]
        },
        include: {
          ratings: {
            include: {
              user: {
                select: {
                  username: true,
                  id: true
                }
              }
            }
          }
        }
      });

      // If game exists in our database, return it
      if (game) {
        // Check if the current user has rated this game
        let userRating = null;
        if (userId) {
          userRating = await prisma.rating.findUnique({
            where: {
              userId_gameId: {
                userId: userId,
                gameId: game.id
              }
            }
          });
        }

        // Transform the game data to match RAWG format
        const transformedGame = {
          id: game.rawgId || game.id,
          name: game.name,
          background_image: game.coverPhoto,
          rating: game.rawgRating || 0,
          ratings_count: game.rawgRatingCount || 0,
          averageRating: game.averageRating,
          description: game.description,
          genres: [],
          platforms: [],
          metacritic: null,
          isFromDatabase: true
        };

        return res.status(200).json({
          game: transformedGame,
          userRating: userRating
        });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue to fetch from RAWG if database fails
    }

    // If game doesn't exist in our database or database is not available, fetch from RAWG
    const { fetchRawgGame } = await import('../../../lib/rawgApi');
    const rawgGame = await fetchRawgGame(id);

    if (!rawgGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Transform RAWG game data
    const transformedRawgGame = {
      id: rawgGame.id.toString(),
      name: rawgGame.name,
      background_image: rawgGame.background_image,
      rating: rawgGame.rating,
      ratings_count: rawgGame.ratings_count,
      averageRating: rawgGame.rating, // Use RAWG rating as fallback
      description: rawgGame.description_raw || rawgGame.description,
      genres: rawgGame.genres || [],
      platforms: rawgGame.platforms || [],
      metacritic: rawgGame.metacritic,
      isFromRawg: true
    };

    res.status(200).json({
      game: transformedRawgGame,
      userRating: null
    });

  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
  }
}