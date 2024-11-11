// Import necessary modules
import jwt from 'jsonwebtoken';
import User from '@/src/utils/models/User.js';
import db from '@/src/lib/db.js';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET;

export async function OPTIONS(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];
  const { token, provider } = await request.json();

  try {
    // Connect to MongoDB
    await db.connect();

    // Verify VK token and get user data (this step is simplified, you'd typically have a service to verify the token)
    // For demonstration, let's assume the token is directly the user ID for simplicity
    const vkUserId = token;

    // Find or create user based on VK data
    let user = await User.findOne({ vkId: vkUserId });
    if (!user) {
      user = new User({
        username: `vk_user_${vkUserId}`,
        vkId: vkUserId,
        isAdmin: false,
        provider: 'vk'
      });
      await user.save();
    }

    // Create JWT token
    const jwtToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '1h' });

    return new NextResponse(
      JSON.stringify({ jwtToken }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('VK login error:', error);
    return new Response(
      JSON.stringify({ message: 'Login failed', error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } finally {
    await db.disconnect();
  }
}
