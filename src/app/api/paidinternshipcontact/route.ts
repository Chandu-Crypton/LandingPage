import { NextRequest, NextResponse } from "next/server";
import PaidInternshipContact from "@/models/PaidInternshipContact";
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


export async function GET() {
    await connectToDatabase();

    try {
        const docs = await PaidInternshipContact.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No contact documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/paidinternshipcontact error:', error);
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

   
    const fullName = formData.get('fullName') as string;
    const department = formData.get('department') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string; // Will need to be converted to a number
    const message = formData.get('message') as string;
    const eligibility = formData.get('eligibility') as string;
    const resume = formData.get('resume') as File | null;

    // --- Validation ---
    if (!message || !fullName || !department  || !email || !phoneNumber || !eligibility ||  !resume) {
      return NextResponse.json(
        { success: false, message: 'Missing required form data fields.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const phoneAsNumber = Number(phoneNumber);
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
    const newEntry = await PaidInternshipContact.create({
      fullName,
      eligibility,
      department,
      email,
      phoneNumber: phoneAsNumber,
      message,
      resume: resumeUrl, // Store the URL, not the file itself
    });

    return NextResponse.json(
      { success: true, data: newEntry, message: 'Application submitted successfully.' },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error('POST /api/paidinternshipcontact error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}

