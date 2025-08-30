import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse the form data
    const { username, email, currentPassword, newPassword, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if username or email already exists
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username,
          id: { not: userId }
        }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: userId }
        }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
    }

    // If changing password, verify current password
    if (newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
    }

    // Prepare update data
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedPassword;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        avatar: true
      }
    });

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
  }
}
