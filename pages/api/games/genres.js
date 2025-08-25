import { GamesAPI } from '../../../lib/gamesApi';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify authentication
  
    try {
      const genres = await GamesAPI.getGenres();
      res.status(200).json({ genres });
    } catch (error) {
      console.error('Error in genres API:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  ;
}