import { NextResponse } from 'next/server';
import db from '@/src/lib/db';
import { verifyToken } from '@/src/utils/auth';
import Testimonial from '@/src/utils/models/Testimonial';

export async function OPTIONS(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function PUT(request, { params }) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];
  const { id } = params;

  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'No token provided' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
            'Access-Control-Allow-Methods': 'PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const user = await verifyToken(token);    
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
            'Access-Control-Allow-Methods': 'PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    await db.connect();
    const updatedData = await request.json();
    const testimonial = await Testimonial.findByIdAndUpdate(id, updatedData, { new: true });

    if (!testimonial) {
      return new NextResponse(
        JSON.stringify({ message: 'Testimonial not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
            'Access-Control-Allow-Methods': 'PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify(testimonial),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
          'Access-Control-Allow-Methods': 'PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to update testimonial' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
          'Access-Control-Allow-Methods': 'PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } finally {
    await db.disconnect();
  }
}

export async function DELETE(request, { params }) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];
  try {
    const { id } = params;
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'No token provided' }),
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user || !user.isAdmin) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 403 }
      );
    }

    await db.connect();

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return new NextResponse(
        JSON.stringify({ message: 'Project not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: 'Project deleted successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
        },
      }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to delete project' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
        },
      }
    );
  } finally {
    await db.disconnect();
  }
}
