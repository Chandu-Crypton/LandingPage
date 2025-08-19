import { NextRequest, NextResponse } from "next/server";
import JobModal from "@/models/JobModal";

import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose";

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


// export async function POST(req: NextRequest) {
//   await connectToDatabase();

//   try {
//     const {
//       addHeading,
//       title,
//       department,
//       location,
//       keyResponsibilities,
//       requirements,
//       jobDescription,
//       jobType,
//       salary,
//       qualification,
//       applicationDeadline,
//       experience,
//       openingType,
//       workEnvironment,
//       benefits
//     } = await req.json();

//     // Convert applicationDeadline to a Date object
//     const parsedDeadline = new Date(applicationDeadline);

//     if (
//       !addHeading || typeof addHeading !== 'string' ||
//       !title || typeof title !== 'string' ||
//       !department || typeof department !== 'string' ||
//       !location || typeof location !== 'string' ||
//       !jobDescription || typeof jobDescription !== 'string' ||
//       !keyResponsibilities || !Array.isArray(keyResponsibilities) ||
//       !requirements || !Array.isArray(requirements) ||
//       !workEnvironment || !Array.isArray(workEnvironment) ||
//       !benefits || !Array.isArray(benefits) ||
//       !salary || typeof salary !== 'string' ||
//       !experience || typeof experience !== 'string' ||
//       !applicationDeadline || isNaN(parsedDeadline.getTime()) || 
//       !openingType || typeof openingType !== 'string' ||
//       !jobType || typeof jobType !== 'string' ||
//       !qualification || typeof qualification !== 'string'
//     ) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid request body format.' },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const newEntry = await JobModal.create({
//       addHeading,
//       title,
//       department,
//       location,
//       keyResponsibilities,
//       requirements,
//       jobDescription,
//       jobType,
//       salary,
//       qualification,
//       applicationDeadline: parsedDeadline,
//       experience,
//       openingType,
//       workEnvironment,
//       benefits
//     });

//     return NextResponse.json(
//       { success: true, data: newEntry, message: 'Job content created successfully.' },
//       { status: 201, headers: corsHeaders }
//     );

//   } catch (error) {
//     console.error('POST /api/job error:', error);
//     const message = error instanceof Error ? error.message : 'Internal Server Error';
//     return NextResponse.json(
//       { success: false, message },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }




// POST handler to create a new job entry
export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const {
            addHeading, // This is now optional
            title,
            department,
            location,
            keyResponsibilities,
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

        // --- VALIDATION ADJUSTMENT ---
        // Removed `!addHeading || typeof addHeading !== 'string' ||` from here.
        // It's optional, so we only validate if it's provided.
        if (
            !title || typeof title !== 'string' ||
            !department || typeof department !== 'string' ||
            !location || typeof location !== 'string' ||
            !jobDescription || typeof jobDescription !== 'string' ||
            !keyResponsibilities || !Array.isArray(keyResponsibilities) ||
            !requirements || !Array.isArray(requirements) ||
            !workEnvironment || !Array.isArray(workEnvironment) ||
            !benefits || !Array.isArray(benefits) ||
            !salary || typeof salary !== 'string' ||
            !experience || typeof experience !== 'string' ||
            !applicationDeadline || isNaN(parsedDeadline.getTime()) ||
            !openingType || typeof openingType !== 'string' ||
            !jobType || typeof jobType !== 'string' ||
            !qualification || typeof qualification !== 'string'
        ) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid required fields. Please check all entries.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Optional validation for addHeading if it's present
        if (addHeading !== undefined && typeof addHeading !== 'string') {
             return NextResponse.json(
                { success: false, message: 'Invalid format for addHeading.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const newEntry = await JobModal.create({
            addHeading: addHeading ? addHeading.trim() : undefined, // Save trimmed string or undefined if empty
            title,
            department,
            location,
            keyResponsibilities,
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
        // Handle specific Mongoose validation errors
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(err => (err as mongoose.Error.ValidatorError).message);
            return NextResponse.json(
                { success: false, message: 'Validation failed: ' + errors.join(', ') },
                { status: 400, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}