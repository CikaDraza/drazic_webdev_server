import db from '@/src/lib/db';
import Product from '@/src/utils/models/Product';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await db.connect();
    const projects = await Product.find().lean();
    await db.disconnect();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const user = await verifyToken(token); // Verify the token and get the user
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await db.connect();
    const project = await request.json();
    const newProject = new Project(project);
    await newProject.save();
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ message: 'Failed to create project' }, { status: 500 });
  } finally {
    await db.disconnect();
  }
}