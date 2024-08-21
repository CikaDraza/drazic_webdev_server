import Testimonial from '@/src/utils/models/Testimonial';
import { NextResponse } from 'next/server';

export async function OPTIONS(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.vercel.app'];
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // Cache the preflight response for 1 day
    },
  });
}

export async function GET(request, { params }) {
  const { email } = params;
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.vercel.app'];

  try {        
    
    const testimonials = await Testimonial.findOne({ client_email: email }).lean();

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
    console.error('Error fetching testimonials:', error.stack || error.message);
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
  }
}