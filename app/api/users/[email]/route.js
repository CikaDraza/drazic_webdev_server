import db from "@/src/lib/db"; // Import your database connection
import User from "@/src/utils/models/User"; // Import your User model
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email query parameter is required' }, { status: 400 });
    }

    await db.connect(); // Connect to the database

    const user = await User.findOne({ email }); // Find user by email

    await db.disconnect(); // Disconnect from the database

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}