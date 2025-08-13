import { NextRequest, NextResponse } from "next/server";
import JobModal from "@/models/JobModal";

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
        const docs = await JobModal.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Job documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/job error:', error);
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
      department,
      location,
      requirements,
      jobDescription,
      jobType,
      salary,
      qualification,
      applicationDeadline,
      experience,
      openingType,
      workEnvironment,
      benefits
    } = await req.json();

    // Convert applicationDeadline to a Date object
    const parsedDeadline = new Date(applicationDeadline);

    if (
      !title || typeof title !== 'string' ||
      !department || typeof department !== 'string' ||
      !location || typeof location !== 'string' ||
      !jobDescription || typeof jobDescription !== 'string' ||
      !requirements || typeof requirements !== 'object' ||
      !Array.isArray(requirements.musthave) ||
      !Array.isArray(requirements.nicetohave) ||
      !workEnvironment || !Array.isArray(workEnvironment) ||
      !benefits || !Array.isArray(benefits) ||
      !salary || typeof salary !== 'string' ||
      !experience || typeof experience !== 'string' ||
      !applicationDeadline || isNaN(parsedDeadline.getTime()) || // ✅ date check
      !openingType || typeof openingType !== 'string' ||
      !jobType || typeof jobType !== 'string' ||
      !qualification || typeof qualification !== 'string'
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body format.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const newEntry = await JobModal.create({
      title,
      department,
      location,
      requirements,
      jobDescription,
      jobType,
      salary,
      qualification,
      applicationDeadline: parsedDeadline,
      experience,
      openingType,
      workEnvironment,
      benefits
    });

    return NextResponse.json(
      { success: true, data: newEntry, message: 'Job content created successfully.' },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error('POST /api/job error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}
