import Testimonial from '@/src/utils/models/Testimonial';
import User from '@/src/utils/models/User';
import { NextResponse } from 'next/server';

export async function OPTIONS(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.vercel.app'];
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // Cache the preflight response for 1 day
    },
  });
}

export async function GET(request, { params }) {
  const { email } = params;
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.vercel.app'];
  try {
    // Check if the user is an admin
    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }
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
    
    // Fetch testimonials based on admin status    
    const testimonials = user?.isAdmin
      ? await Testimonial.find()
      : await Testimonial.find({ client_email: email });

      return new NextResponse(
        JSON.stringify(testimonials),
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
    console.error('Error fetching testimonials:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch testimonials' }),
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
  }
}
