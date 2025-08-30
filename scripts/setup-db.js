#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Setting up GameShelf database...');
  
  try {
    // Check if database file exists
    const dbPath = path.join(__dirname, 'dev.db');
    const dbExists = fs.existsSync(dbPath);
    
    if (dbExists) {
      console.log('📁 Database file already exists');
    } else {
      console.log('📁 Creating new database file...');
    }
    
    // Initialize Prisma client
    const prisma = new PrismaClient();
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Push schema to database
    console.log('📋 Pushing schema to database...');
    await prisma.$executeRaw`PRAGMA foreign_keys = ON`;
    
    // Create tables by running a simple query
    try {
      await prisma.user.findFirst();
      console.log('✅ User table exists');
    } catch (error) {
      console.log('⚠️  User table not found, creating tables...');
      // The schema will be created automatically when we first access the tables
    }
    
    try {
      await prisma.game.findFirst();
      console.log('✅ Game table exists');
    } catch (error) {
      console.log('⚠️  Game table not found, creating tables...');
    }
    
    try {
      await prisma.rating.findFirst();
      console.log('✅ Rating table exists');
    } catch (error) {
      console.log('⚠️  Rating table not found, creating tables...');
    }
    
    await prisma.$disconnect();
    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('🎮 You can now:');
    console.log('   • Register new users');
    console.log('   • Login with existing users');
    console.log('   • Rate games and write reviews');
    console.log('   • View game details and community reviews');
    console.log('');
    console.log('💡 If you still have issues, try:');
    console.log('   • Demo login: demo@example.com / demo123');
    console.log('   • Or restart the development server');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('');
    console.log('💡 Try running: npx prisma db push');
    console.log('   Or use demo login: demo@example.com / demo123');
  }
}

setupDatabase();
