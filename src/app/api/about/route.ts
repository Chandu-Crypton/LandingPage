import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import About from "@/models/About";


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const aboutPage = await About.find({}).sort({ createdAt: -1 });
    if (!aboutPage) return NextResponse.json({ message: 'About page not found' }, { status: 404,headers: corsHeaders });
    return NextResponse.json(aboutPage);
  } catch (err) {
    return NextResponse.json({ message: 'Error getting about page', error: err }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { content, version, isActive, isDeleted } = await req.json();
    if (!content) {
      return NextResponse.json({ message: 'content is required' }, { status: 400, headers: corsHeaders });
    }
    const aboutPage = await About.create({
      content,
      version,
      isActive,
      isDeleted
    });
    return NextResponse.json(aboutPage, { status: 201, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ message: 'Error creating about page', error: err }, { status: 500, headers: corsHeaders });
  }
}