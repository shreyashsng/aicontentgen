import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET() {
  try {
    const result = await db.select().from(users).limit(1);
    console.log('Drizzle query successful:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data: result 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Database connection failed' 
    }, { status: 500 });
  }
} 