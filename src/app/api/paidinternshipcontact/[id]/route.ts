import {NextRequest, NextResponse } from "next/server";
import PaidInternshipContact from "@/models/PaidInternshipContact";
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose";
import imagekit from "@/utils/imagekit";
import { v4 as uuidv4 } from 'uuid';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS", // Note: No POST here
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface IPaidInternshipContact {
    fullName?: string,
    email?: string,
    phoneNumber?: number,
    message?: string,
    department?: string,
    eligibility?: string,
    resume?: string

}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const doc = await PaidInternshipContact.findById(id);
        if (!doc) {
            return NextResponse.json(
                { success: false, message: 'Applied Paid Internship Candidates data not found.' },
                { status: 404, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: true, data: doc },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error(`GET /api/paidinternshipcontact/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}


export async function PUT(req: Request) {
  await connectToDatabase();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: 'Invalid or missing ID.' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const formData = await req.formData();
    const updateData: Partial<IPaidInternshipContact> = {};

    // Get and validate fields from FormData
    const fullName = formData.get('fullName') as string | null;
    const email = formData.get('email') as string | null;
    const phone = formData.get('phoneNumber') as string | null;
    const message = formData.get('message') as string | null;
    const department = formData.get('department') as string | null;
    const eligibility = formData.get('eligibility') as string | null;
    const resumeFile = formData.get('resume') as File | null;
    
    // --- Text Field Validation and Assignment ---
    
    if (fullName !== null && typeof fullName === 'string') updateData.fullName = fullName;
    if (department !== null && typeof department === 'string') updateData.department = department;
    if (message !== null && typeof message === 'string') updateData.message = message;
    if (eligibility !== null && typeof eligibility === 'string') updateData.eligibility = eligibility;
   
    // --- Email Validation ---
    if (email !== null && typeof email === 'string') {
      const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: 'Invalid email address format.' },
          { status: 400, headers: corsHeaders }
        );
      }
      updateData.email = email;
    }

    // --- Phone Number Validation ---
    if (phone !== null && typeof phone === 'string') {
      const phoneNumber = Number(phone);
      if (isNaN(phoneNumber) || !Number.isInteger(phoneNumber) || phoneNumber.toString().length < 7 || phoneNumber.toString().length > 13) {
        return NextResponse.json(
          { success: false, message: 'Invalid phone number format. Must be a valid integer.' },
          { status: 400, headers: corsHeaders }
        );
      }
      updateData.phoneNumber = phoneNumber;
    }

    // --- Resume File Upload Logic ---
    if (resumeFile && resumeFile instanceof File && resumeFile.size > 0) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${uuidv4()}-${resumeFile.name}`,
        folder: '/paidinternship-candidates-resumes',
      });

      if (uploadResponse.url) {
        updateData.resume = uploadResponse.url;
      } else {
        return NextResponse.json(
          { success: false, message: 'Failed to upload new resume file.' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // Check if any update data is provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields provided for update.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedDoc = await PaidInternshipContact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDoc) {
      return NextResponse.json(
        { success: false, message: 'Applied Candidates data not found for update.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedDoc, message: 'Applied Candidates updated successfully.' },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error(`PUT /api/paidinternshipcontact/${id} error:`, error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const deletedDoc = await PaidInternshipContact.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Applied Paid Internship Candidates not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: true, data: deletedDoc, message: 'Applied  Paid Internship Candidates  deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error(`DELETE /api/paidinternshipcontact/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}