import { NextResponse } from 'next/server';
import db from '@/src/lib/db.js';
import Project from '@/src/utils/models/Project.js';
import { verifyToken } from '@/src/utils/auth.js';

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await db.connect();
    const updatedData = await request.json();
    const project = await Project.findByIdAndUpdate(id, updatedData, { new: true });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ message: 'Failed to update project' }, { status: 500 });
  } finally {
    await db.disconnect();
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

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
    const result = await Project.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ message: 'Failed to delete project' }, { status: 500 });
  } finally {
    await db.disconnect();
  }
}
