import db from "@/src/lib/db"; // Import your database connection
import User from "@/src/utils/models/User"; // Import your User model
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request, { params }) {
const origin = request.headers.get('Origin');
const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];

  try {
    const { userId, token } = params;
    
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

    // Find user by email
    const user = await User.findById(userId);
    if (!user) {
      // Create user
      const user = new User({
        name: `vk_user-${userId}`,
        email: `vk_${userId}@vkontak.vk`,
        password: `password_${userId}`,
        vkId: userId,
        isAdmin: false,
        provider: 'vk'
      });

      await user.save();
      console.log('Client user created successfully');

      // Return success response
      return new NextResponse(JSON.stringify({ message: 'Client user created successfully' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return user data
    return new NextResponse(
      JSON.stringify(user),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );

  } catch (error) {
    console.error('Error fetching user:', error);

    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } finally {
    // Disconnect from MongoDB
    await db.disconnect();
  }
}

// Handle OPTIONS request for preflight checks
export async function OPTIONS(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];
  return new NextResponse(
    null,
    {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}