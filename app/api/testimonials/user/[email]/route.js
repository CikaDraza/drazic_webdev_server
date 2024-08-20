import Testimonial from '@/src/utils/models/Testimonial';
import User from '@/src/utils/models/User';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { email } = params;

  try {
    // Check if the user is an admin
    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    // Fetch testimonials based on admin status
    const testimonials = user?.isAdmin
      ? await Testimonial.find()
      : await Testimonial.find({ client_email: email });

    return new NextResponse(
      JSON.stringify(testimonials),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch testimonials' }),
      { status: 500 }
    );
  }
}
