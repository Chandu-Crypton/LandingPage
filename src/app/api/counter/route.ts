import { NextRequest, NextResponse } from "next/server";
import Counter from "@/models/CounterModal";

import { connectToDatabase } from "@/utils/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET() {
  await connectToDatabase();

  try {
    const docs = await Counter.find({});

    if (docs.length === 0) {
      return NextResponse.json(
        { success: true, data: [], message: 'No documents found.' },
        { status: 200, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: docs },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET /api/counter error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}


export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { title, count, description } = await req.json();

    if (
      !title || typeof title !== 'string' ||
      count === undefined || typeof count !== 'number' ||
      !description || typeof description !== 'string'
    ) {
      return NextResponse.json(
        { success: false, message: 'Title and description must be strings, and count must be a number.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const [newEntry] = await Counter.create([{ title, count, description }]);

    return NextResponse.json(
      { success: true, data: newEntry, message: 'Counter content created successfully.' },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('POST /api/counter error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}