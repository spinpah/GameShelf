// pages/api/auth/login.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Try to find user in database
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback: Check if it's a demo user
      if (email === 'demo@example.com' && password === 'demo123') {
        const demoUser = {
          id: 'demo-user-id',
          email: 'demo@example.com',
          username: 'demo_user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: demoUser.id, email: demoUser.email },
          process.env.NEXTAUTH_SECRET || 'fallback-secret',
          { expiresIn: '7d' }
        );
        
        return res.status(200).json({
          message: 'Login successful (demo mode)',
          user: demoUser,
          token
        });
      }
      
      return res.status(500).json({ 
        message: 'Database not available. Please try demo login: demo@example.com / demo123' 
      });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
  }
}