import bcrypt from 'bcryptjs';
import User from '../../../src/utils/models/User';
import db from '../../../src/lib/db';

export async function GET(request) {
  try {
    // Connect to MongoDB
    await db.connect();

    // Define user data
    const email = 'drazic.milan@gmail.com';
    const plainPassword = 'Dmd-2024';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create user
    const user = new User({
      name: 'Admin User', // Add a name field as required by your schema
      email: email,
      password: hashedPassword,
      isAdmin: true
    });

    await user.save();
    console.log('Admin user created successfully');

    // Return success response
    return new Response(JSON.stringify({ message: 'Admin user created successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating admin user:', error);

    // Return error response
    return new Response(JSON.stringify({ message: 'Error creating admin user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    // Disconnect from MongoDB
    await db.disconnect();
  }
}