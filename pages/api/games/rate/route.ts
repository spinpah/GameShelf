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
    
    if (rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 10' }, 
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
    
    // Rate the game
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
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}