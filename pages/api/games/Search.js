import { GamesAPI } from '../../../lib/gamesApi';


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  
    try {
      const { q: query, page = 1, page_size = 20 } = req.query;
      


      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const result = await GamesAPI.searchGames(query, parseInt(page), parseInt(page_size));
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in search games API:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  ;
}