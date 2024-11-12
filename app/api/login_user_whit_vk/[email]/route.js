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

export async function POST(request, { params }) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];

  try {
    const { email } = params;

    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    try {
      jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }
    // Connect to MongoDB
    await db.connect();

    // Find or create user based on VK data
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: `vk_name_${email}`,
        email: email,
        username: `vk_user_${email}`,
        vkId: `vkUserId_${token}`,
        isAdmin: false,
        provider: 'vk'
      });
      await user.save();
    }

    // Create JWT token
    const jwtToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '24h' });

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
