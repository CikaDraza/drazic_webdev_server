import Testimonial from '@/src/utils/models/Testimonial';
import User from '@/src/utils/models/User';
import { NextResponse } from 'next/server';
import db from '@/src/lib/db.js';

export async function GET(request, { params }) {
  const { email } = params;
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];

  try {
    console.log(`Fetching testimonials for email: ${email}`);
    
    await db.connect();
    
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }
    
    const testimonials = user.isAdmin
      ? await Testimonial.find().lean()
      : await Testimonial.find({ client_email: email }).lean();

    return new NextResponse(
      JSON.stringify(testimonials),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
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
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } finally {
    await db.disconnect();
  }
}