import db from '@/src/lib/db.js';
import Project from '@/src/utils/models/Project';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/src/utils/auth'; 

export async function GET(request) {
  try {
    await db.connect();
    const projects = await Project.find();
    return new NextResponse(
      JSON.stringify(projects),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://drazic-webdev.vercel.app',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch projects' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://drazic-webdev.vercel.app',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } finally {
    await db.disconnect();
  }
}

export async function POST(request) {
  try {
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
    const project = await request.json();
    console.log('Project data received:', project); // Debugging line

    const newProject = new Project(project);
    await newProject.save();

    return NextResponse.redirect(new URL('/api/projects', request.url));
  } catch (error) {
    console.error('Error creating project:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to create project' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://drazic-webdev.vercel.app',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } finally {
    await db.disconnect();
  }
}
