// pages/api/auth/me.js
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Use the auth middleware
  verifyToken(req, res, () => {
    res.status(200).json({ user: req.user });
  });
}