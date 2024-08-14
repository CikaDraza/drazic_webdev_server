import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../src/utils/models/User';
import db from '../src/lib/db';

const SECRET_KEY = process.env.JWT_SECRET; // Ensure you have this in your .env file

export async function POST(request) {
  try {
    // Parse request body
    const { email, password } = await request.json();

    // Connect to MongoDB
    await db.connect();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '1h' });

    // Return success response with token
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);

    // Return error response
    return new Response(JSON.stringify({ message: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    // Disconnect from MongoDB
    await db.disconnect();
  }
}