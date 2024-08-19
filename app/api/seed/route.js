import db from "@/src/lib/db";
import data from "@/src/utils/data";
import Project from "@/src/utils/models/Project";
import Testimonial from "@/src/utils/models/Testimonial";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await db.connect();
    await Project.deleteMany();
    await Project.insertMany(data?.project);
    await Testimonial.deleteMany();
    await Testimonial.insertMany(data?.testimonial);
    await db.disconnect();

    return NextResponse.json({ message: 'Seeding successful' }, { status: 200 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Error seeding database' }, { status: 500 });
  }
}
