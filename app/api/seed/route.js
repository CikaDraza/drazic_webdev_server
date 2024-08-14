import db from "@/src/lib/db";
import data from "@/src/utils/data";
import Product from "@/src/utils/models/Product";
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await db.connect();
    await Product.deleteMany();
    await Product.insertMany(data.products);
    await db.disconnect();

    return NextResponse.json({ message: 'Seeding successful' }, { status: 200 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Error seeding database' }, { status: 500 });
  }
}
