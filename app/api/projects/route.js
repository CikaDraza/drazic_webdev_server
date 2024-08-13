import db from '@/src/lib/db';
import Product from '@/src/utils/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await db.connect();
    const projects = await Product.find().lean();
    await db.disconnect();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}
