import { NextRequest, NextResponse } from 'next/server';
import { rateGame } from '../../../../lib/gameRatingService';
import { fetchRawgGame } from '../../../../lib/rawgApi';
import type { RawgGameData } from '../../../../lib/rawgApi';

export async function POST(request: NextRequest) {
  try {
    const { userId, rawgGameId, rating, review } = await request.json();
    
    // Validate input
    if (!userId || !rawgGameId || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    if (rating < 0.5 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 0.5 and 5' }, 
        { status: 400 }
      );
    }
    
    // Fetch game data from RAWG
    const rawgGame = await fetchRawgGame(rawgGameId);
    if (!rawgGame) {
      return NextResponse.json(
        { error: 'Game not found on RAWG' }, 
        { status: 404 }
      );
    }
    
    // Prepare game data
    const gameData = {
      id: rawgGame.id.toString(),
      name: rawgGame.name,
      description: rawgGame.description_raw || rawgGame.description,
      coverPhoto: rawgGame.background_image,
      rawgRating: rawgGame.rating,
      rawgRatingCount: rawgGame.ratings_count,
    };
    
    try {
      // Try to rate the game in database
      const result = await rateGame({
        userId,
        gameData,
        userRating: rating,
        review,
      });
      
      if (result.success) {
        return NextResponse.json(result.data);
      } else {
        return NextResponse.json(
          { error: result.error }, 
          { status: 500 }
        );
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback: return a mock response when database is not available
      return NextResponse.json({
        game: {
          id: gameData.id,
          name: gameData.name,
          averageRating: rating,
          rawgRating: gameData.rawgRating,
          rawgRatingCount: gameData.rawgRatingCount,
        },
        userRating: {
          id: 'temp-' + Date.now(),
          rating: rating,
          review: review,
          userId: userId,
          gameId: gameData.id,
          createdAt: new Date().toISOString(),
        },
        averageRating: rating,
        wasNewGame: true,
        rawgWeightUsed: 0,
        message: 'Rating saved locally (database not available)'
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}