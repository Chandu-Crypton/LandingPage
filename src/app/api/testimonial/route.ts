import { NextRequest, NextResponse } from "next/server";
import Testimonial from "@/models/Testimonial";

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
        const docs = await Testimonial.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No testimonial documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/testimonial error:', error);
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
    const {
      title,
      fullName,
      description,
      rating
    } = await req.json();

    if (
      !title || typeof title !== 'string' ||
      !fullName || typeof fullName !== 'string' ||
      !description || typeof description !== 'string' ||
      !rating || typeof rating !== 'number' 
      
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body format.' },
        { status: 400, headers: corsHeaders }
      );
    }

    
        

    const newEntry = await Testimonial.create({
      title,
      fullName,
      description,
      rating
    });

    return NextResponse.json(
      { success: true, data: newEntry, message: 'Testimonial content created successfully.' },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error('POST /api/testimonial error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}
