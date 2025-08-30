import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GameData {
  id: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  rawgRating?: number;
  rawgRatingCount?: number;
}

interface RateGameParams {
  userId: string;
  gameData: GameData;
  userRating: number;
  review?: string;
}

export async function rateGame({ userId, gameData, userRating, review }: RateGameParams) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Check if game exists in our database
      const existingGame = await tx.game.findFirst({
        where: { 
          OR: [
            { id: gameData.id },
            { rawgId: gameData.id }
          ]
        },
        include: {
          ratings: {
            select: { rating: true }
          }
        }
      });

      let game;
      let shouldUseRawgRating = false;
      let rawgWeight = 0;

      if (existingGame) {
        // Game exists - update it
        game = await tx.game.update({
          where: { id: existingGame.id },
          data: {
            name: gameData.name,
            description: gameData.description,
            coverPhoto: gameData.coverPhoto,
            rawgRating: gameData.rawgRating,
            rawgRatingCount: gameData.rawgRatingCount,
            rawgId: gameData.id, // Ensure rawgId is set
          },
        });
        
        // Use existing average rating as base, don't include RAWG rating
        shouldUseRawgRating = false;
      } else {
        // Game doesn't exist - create it
        game = await tx.game.create({
          data: {
            rawgId: gameData.id,
            name: gameData.name,
            description: gameData.description,
            coverPhoto: gameData.coverPhoto,
            rawgRating: gameData.rawgRating,
            rawgRatingCount: gameData.rawgRatingCount,
          },
        });
        
        // For new games, use RAWG rating with weight based on rating count
        shouldUseRawgRating = true;
        rawgWeight = calculateRawgWeight(gameData.rawgRatingCount || 0);
      }

      // Step 2: Upsert the user's rating
      const rating = await tx.rating.upsert({
        where: {
          userId_gameId: {
            userId,
            gameId: game.id, // Use the game.id from our database
          },
        },
        update: {
          rating: userRating,
          review,
        },
        create: {
          userId,
          gameId: game.id, // Use the game.id from our database
          rating: userRating,
          review,
        },
      });

      // Step 3: Calculate new average rating
      const userRatings = await tx.rating.findMany({
        where: { gameId: game.id },
        select: { rating: true },
      });

      let averageRating: number;

      // Calculate new average rating using the formula:
      // (RAWG rating * RAWG rating count + user rating * 1) / (RAWG rating count + 1)
      if (gameData.rawgRating && gameData.rawgRatingCount) {
        const rawgTotal = gameData.rawgRating * gameData.rawgRatingCount;
        const userTotal = userRatings.reduce((sum, r) => sum + r.rating, 0);
        const totalRatings = gameData.rawgRatingCount + userRatings.length;
        
        averageRating = totalRatings > 0 ? (rawgTotal + userTotal) / totalRatings : gameData.rawgRating;
      } else {
        // Fallback to simple average if no RAWG data
        averageRating = userRatings.length > 0 
          ? userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length 
          : userRating;
      }

      // Step 4: Update the game's average rating
      const updatedGame = await tx.game.update({
        where: { id: game.id },
        data: { averageRating },
        include: {
          ratings: {
            include: {
              user: {
                select: { username: true, id: true },
              },
            },
          },
        },
      });

      return {
        game: updatedGame,
        userRating: rating,
        averageRating,
        wasNewGame: !existingGame,
        rawgWeightUsed: shouldUseRawgRating ? rawgWeight : 0,
      };
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error rating game:', error);
    return {
      success: false,
      error: 'Failed to rate game',
    };
  }
}

// Calculate weight for RAWG rating based on number of ratings
function calculateRawgWeight(ratingsCount: number): number {
  if (ratingsCount === 0) return 0;
  
  // Progressive weight system:
  // 1-100 ratings: weight = 1-10
  // 100-1000 ratings: weight = 10-20
  // 1000-10000 ratings: weight = 20-50
  // 10000+ ratings: weight = 50-100
  
  if (ratingsCount <= 100) {
    return Math.max(1, Math.floor(ratingsCount / 10));
  } else if (ratingsCount <= 1000) {
    return 10 + Math.floor((ratingsCount - 100) / 90);
  } else if (ratingsCount <= 10000) {
    return 20 + Math.floor((ratingsCount - 1000) / 300);
  } else {
    return Math.min(100, 50 + Math.floor((ratingsCount - 10000) / 1000));
  }
}

// Calculate weighted average between RAWG and user ratings
function calculateWeightedAverage({
  rawgRating,
  rawgWeight,
  userRatings,
}: {
  rawgRating: number;
  rawgWeight: number;
  userRatings: number[];
}): number {
  const rawgWeightedSum = rawgRating * rawgWeight;
  const userRatingsSum = userRatings.reduce((sum, rating) => sum + rating, 0);
  const userRatingsWeight = userRatings.length; // Each user rating has weight of 1
  
  const totalWeightedSum = rawgWeightedSum + userRatingsSum;
  const totalWeight = rawgWeight + userRatingsWeight;
  
  return totalWeight > 0 ? totalWeightedSum / totalWeight : rawgRating;
}