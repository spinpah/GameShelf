import { GamesAPI } from '../../../lib/gamesApi';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify authentication
  verifyToken(req, res, async () => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.page_size) || 20;
      
      const result = await GamesAPI.fetchPopularGames(page, pageSize);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in popular games API:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}
