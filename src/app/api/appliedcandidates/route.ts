import { NextRequest, NextResponse } from "next/server";
import AppliedCandidates from "@/models/AppliedCandidates";
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET(req: NextRequest) {
    await connectToDatabase();

    try {
       // Get the 'title' query parameter from the request URL
        const title = req.nextUrl.searchParams.get('title');

        // Build the query object
        const query = title ? { title } : {};

        // Find documents based on the query object
        const docs = await AppliedCandidates.find(query);

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Applied Candidates documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }


        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/appliedcandidates error:', error);
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
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const fullName = formData.get('fullName') as string;
    const location = formData.get('location') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string; // Will need to be converted to a number
    const workplacetype = formData.get('workplacetype') as string;
    const employmenttype = formData.get('employmenttype') as string;
    const background = formData.get('background') as string;
    const resume = formData.get('resume') as File | null;

    // --- Validation ---
    if (!title || !fullName || !location || !email || !phone || !workplacetype || !employmenttype || !background || !resume) {
      return NextResponse.json(
        { success: false, message: 'Missing required form data fields.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const phoneAsNumber = Number(phone);
    if (isNaN(phoneAsNumber)) {
      return NextResponse.json(
        { success: false, message: 'Phone number must be a valid number.' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // --- Resume File Upload Logic ---
    let resumeUrl = '';
    if (resume && resume instanceof File && resume.size > 0) {
      const buffer = Buffer.from(await resume.arrayBuffer());

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${uuidv4()}-${resume.name}`,
        folder: '/applied-candidates-resumes',
      });

      if (uploadResponse.url) {
        resumeUrl = uploadResponse.url;
      } else {
        return NextResponse.json(
          { success: false, message: 'Failed to upload resume.' },
          { status: 500, headers: corsHeaders }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Resume file is required.' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // --- Create new entry in the database ---
    const newEntry = await AppliedCandidates.create({
      title,
      fullName,
      location,
      email,
      phone: phoneAsNumber,
      workplacetype,
      employmenttype,
      background,
      resume: resumeUrl, // Store the URL, not the file itself
    });

    return NextResponse.json(
      { success: true, data: newEntry, message: 'Application submitted successfully.' },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error('POST /api/appliedcandidates error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}

