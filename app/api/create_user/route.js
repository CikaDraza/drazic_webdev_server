import bcrypt from 'bcryptjs';
import User from '../../../src/utils/models/User';
import db from '../../../src/lib/db';

export async function GET(request) {
  try {
    // Connect to MongoDB
    await db.connect();

    // Define user data
    const name = 'Mila Mo';
    const email = 'mila.mo@gmail.com';
    const plainPassword = '#Mila22#';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create user
    const user = new User({
      name: name, // Add a name field as required by your schema
      email: email,
      password: hashedPassword,
      isAdmin: false
    });

    await user.save();
    console.log('Client user created successfully');

    // Return success response
    return new Response(JSON.stringify({ message: 'Client user created successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating Client user:', error);

    // Return error response
    return new Response(JSON.stringify({ message: 'Error creating Client user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    // Disconnect from MongoDB
    await db.disconnect();
  }
}