import db from "@/src/lib/db";
import setCorsHeaders from "@/src/utils/cors";
import User from "@/src/utils/models/User";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function handler(request) {
  const headers = setCorsHeaders(request);
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const { userId, token } = request.body;

    // Verify JWT token
    try {
      jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers });
    }

    await db.connect();
    const user = await User.findById(userId);
    if (!user) {
      const newUser = new User({
        name: `vk_name_${userId}`,
        username: `vk_user_${userId}`,
        email: `vk_${userId}@vkontak.vk`,
        vkId: userId,
        isAdmin: false,
        provider: 'vk'
      });
      await newUser.save();
      return new Response(JSON.stringify({ message: 'User created successfully', user: newUser }), { status: 201, headers });
    }

    return new Response(JSON.stringify(user), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers });
  } finally {
    await db.disconnect();
  }
}