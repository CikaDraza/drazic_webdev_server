import db from "@/src/lib/db";
import { verifyToken } from "@/src/utils/auth";
import Project from "@/src/utils/models/Project";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'No token provided' }),
        { status: 401, headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const user = await verifyToken(token);
    if (!user || !user.isAdmin) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 403, headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    await db.connect();
    const projectData = await request.json();
    const newProject = new Project(projectData);
    await newProject.save();

    return new NextResponse(
      JSON.stringify(newProject),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to create project' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } finally {
    await db.disconnect();
  }
}