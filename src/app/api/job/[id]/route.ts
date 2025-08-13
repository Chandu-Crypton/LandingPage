// src/app/api/counter/[id]/route.js
import { NextResponse } from "next/server";
import JobModal from "@/models/JobModal";
import { connectToDatabase } from "@/utils/db";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS", // Note: No POST here
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface IJob {
    title?: string;
    location?: number;
    department?: string;
    requirements?: [string];
    workEnvironment?: [string];
    benefits?: [string];
    jobDescription?: string;
    salary?: string;
    experience?: string;
    qualification?: string;
    openingType?: string;
    jobType?: string;
    applicationDeadline?: Date;
}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// GET a specific counter by ID
export async function GET(req: Request) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const doc = await JobModal.findById(id);
        if (!doc) {
            return NextResponse.json(
                { success: false, message: 'Job data not found.' },
                { status: 404, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: true, data: doc },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error(`GET /api/job/${id} error:`, error);
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

    try {
        const body = await req.json();
        const updateData: Partial<IJob> = {};

        if (typeof body.title === 'string') updateData.title = body.title;
        if (typeof body.location === 'string') updateData.location = body.location;
        if (typeof body.department === 'string') updateData.department = body.department;
        if (typeof body.jobDescription === 'string') updateData.jobDescription = body.jobDescription;

        if (body.requirements && typeof body.requirements === 'object') {
            updateData.requirements = body.requirements;
        }
        if (Array.isArray(body.workEnvironment)) updateData.workEnvironment = body.workEnvironment;
        if (Array.isArray(body.benefits)) updateData.benefits = body.benefits;

        if (typeof body.salary === 'string') updateData.salary = body.salary;
        if (typeof body.experience === 'string') updateData.experience = body.experience;
        if (typeof body.openingType === 'string') updateData.openingType = body.openingType;
        if (typeof body.jobType === 'string') updateData.jobType = body.jobType;
        if (typeof body.qualification === 'string') updateData.qualification = body.qualification;

        if (body.applicationDeadline) {
            const parsedDeadline = new Date(body.applicationDeadline);
            if (!isNaN(parsedDeadline.getTime())) {
                updateData.applicationDeadline = parsedDeadline;
            } else {
                throw new Error('Invalid applicationDeadline format. Expected a valid date string.');
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No valid fields provided for update.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedDoc = await JobModal.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            return NextResponse.json(
                { success: false, message: 'Job data not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedDoc, message: 'Job updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`PUT /api/job/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}


// DELETE a specific counter by ID
export async function DELETE(req: Request) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const deletedDoc = await JobModal.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Job not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: true, data: deletedDoc, message: 'Job deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error(`DELETE /api/job/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}