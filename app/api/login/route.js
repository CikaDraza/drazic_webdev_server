import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../src/utils/models/User';
import db from '../src/lib/db';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET; 

export async function POST(request) {
  try {

    const { email, password } = await request.json();

    await db.connect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '1h' });

    return NextResponse.json({ token }, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json({ message: 'Login failed' }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await db.disconnect();
  }
}