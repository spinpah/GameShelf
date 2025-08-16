import { GamesAPI } from '../../../lib/gamesApi';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify authentication
  verifyToken(req, res, async () => {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ message: 'Game ID is required' });
      }
      
      const game = await GamesAPI.getGameDetails(id);
      
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
      
      res.status(200).json({ game });
    } catch (error) {
      console.error('Error in game details API:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}