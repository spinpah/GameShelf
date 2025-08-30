import { PrismaClient } from '@prisma/client';
import { GamesAPI } from '../../../lib/gamesApi';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 20;
    const offset = (page - 1) * pageSize;
    
    let transformedDbGames = [];
    
    try {
      // First, get games from our database that have been rated
      const dbGames = await prisma.game.findMany({
        where: {
          averageRating: {
            not: null
          }
        },
        orderBy: {
          averageRating: 'desc'
        },
        take: pageSize,
        skip: offset,
        include: {
          ratings: {
            select: {
              rating: true
            }
          }
        }
      });

      // Transform database games to match RAWG format
      transformedDbGames = dbGames.map(game => ({
        id: game.rawgId || game.id,
        name: game.name,
        background_image: game.coverPhoto,
        rating: game.rawgRating || 0,
        ratings_count: game.rawgRatingCount || 0,
        genres: [],
        platforms: [],
        metacritic: null,
        averageRating: game.averageRating,
        isFromDatabase: true
      }));
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with empty database games
    }

    // If we don't have enough games in our database, fetch from RAWG
    if (transformedDbGames.length < pageSize) {
      const rawgGames = await GamesAPI.fetchPopularGames(page, pageSize);
      
      // Merge RAWG games with our database games
      const mergedGames = [...transformedDbGames];
      
      for (const rawgGame of rawgGames.games) {
        try {
          // Check if this game is already in our database
          const existingGame = await prisma.game.findFirst({
            where: { 
              OR: [
                { rawgId: rawgGame.id.toString() },
                { id: rawgGame.id.toString() }
              ]
            }
          });
          
          if (!existingGame) {
            // Add RAWG game to merged list
            mergedGames.push({
              id: rawgGame.id.toString(),
              name: rawgGame.name,
              background_image: rawgGame.background_image,
              rating: rawgGame.rating,
              ratings_count: rawgGame.ratings_count,
              genres: rawgGame.genres,
              platforms: rawgGame.platforms,
              metacritic: rawgGame.metacritic,
              averageRating: rawgGame.rating, // Use RAWG rating as fallback
              isFromRawg: true
            });
          }
        } catch (dbError) {
          // If database check fails, add the game anyway
          mergedGames.push({
            id: rawgGame.id.toString(),
            name: rawgGame.name,
            background_image: rawgGame.background_image,
            rating: rawgGame.rating,
            ratings_count: rawgGame.ratings_count,
            genres: rawgGame.genres,
            platforms: rawgGame.platforms,
            metacritic: rawgGame.metacritic,
            averageRating: rawgGame.rating,
            isFromRawg: true
          });
        }
      }
      
      // Sort by rating and limit to pageSize
      mergedGames.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      const finalGames = mergedGames.slice(0, pageSize);
      
      res.status(200).json({
        games: finalGames,
        hasNext: finalGames.length === pageSize,
        total: mergedGames.length
      });
    } else {
      // We have enough games in our database
      res.status(200).json({
        games: transformedDbGames,
        hasNext: transformedDbGames.length === pageSize,
        total: transformedDbGames.length
      });
    }
  } catch (error) {
    console.error('Error in popular games API:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
  }
}
