// src/app/api/counter/[id]/route.js
import { NextResponse } from "next/server";
import JobModal from "@/models/JobModal";
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS", // Note: No POST here
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface IJob {
    title?: string;
    location?: string;
    department?: string;
    keyResponsibilities?: string[];
    requiredSkills?: string[];
    requirements?: string[];
    workEnvironment?: string[];
    benefits?: Array<{ title: string; description: string }>;
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
        // Validate ID format early
        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Job ID is required for update.' },
                { status: 400, headers: corsHeaders }
            );
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: 'Invalid Job ID format.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const body = await req.json(); // Assuming JSON body for PUT requests
        const updateData: Partial<IJob> = {};

        // Iterate over incoming body to populate updateData
        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                // Handle specific field types/formats
                if (key === 'applicationDeadline' && body[key]) {
                    updateData[key] = new Date(body[key]);
                } else if (key === 'benefits') {
                    if (Array.isArray(body[key])) {
                        // Ensure benefits are structured correctly as per your schema
                        updateData.benefits = body[key].map((b: { title?: string; description?: string }) => ({
                            title: String(b.title || '').trim(),
                            description: String(b.description || '').trim()
                        })).filter((b) => b.title !== '' || b.description !== ''); // Filter out completely empty benefit objects
                    } else {
                        return NextResponse.json(
                            { success: false, message: 'Invalid format for benefits during update. Must be an array of objects.' },
                            { status: 400, headers: corsHeaders }
                        );
                    }
                } else if (
                    ['keyResponsibilities', 'requiredSkills', 'requirements', 'workEnvironment'].includes(key)
                ) {
                    const filtered = (body[key] as string[]).filter(
                        (item: string) => item.trim() !== ''
                    );

                    updateData[key as Extract<
                        keyof IJob,
                        'keyResponsibilities' | 'requiredSkills' | 'requirements' | 'workEnvironment'
                    >] = filtered;
                } else if (body[key] !== undefined && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'isDeleted') {
                    // Directly assign other fields if they are not undefined and not internal Mongoose fields
                    updateData[key as keyof IJob] = body[key];
                }
            }
        }

        // If no fields are provided in the update, return an error
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No fields provided for update.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Find and update the job document
        // Use $set to update only the fields present in updateData (partial update)
        // new: true returns the updated document, runValidators: true ensures schema validations run
        const updatedJob = await JobModal.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).lean();

        if (!updatedJob) {
            return NextResponse.json(
                { success: false, message: 'Job not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedJob, message: 'Job updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/job/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
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