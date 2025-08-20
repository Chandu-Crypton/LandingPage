import { NextRequest, NextResponse } from "next/server";
import NewsLetter from "@/models/NewsLetter";
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose"; // Import mongoose to check for valid ObjectId

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface INewsLetter {
    subject?: string;
    message?: string;
}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing Technology ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {

        const newsletter = await NewsLetter.findById(id);

        if (!newsletter) {
            return NextResponse.json(
                { success: false, message: 'Newsletter not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: newsletter, message: 'Newsletter fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/newsletter/[id] error:', error);
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

   
    // Validate ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        const body = await req.json();
         const updateData: Partial<INewsLetter> = {};

        if (body.subject !== undefined && typeof body.subject === 'string') {
            updateData.subject = body.subject;
        }
        if (body.message !== undefined && typeof body.message === 'string') {
            updateData.message = body.message;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No valid fields provided for update.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedDoc = await NewsLetter.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            return NextResponse.json(
                { success: false, message: 'Newsletter document not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedDoc, message: 'Newsletter content updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`PUT /api/newsletter/${id} error:`, error);
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


    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        const deletedDoc = await NewsLetter.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Newsletter document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Newsletter content deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/newsletter/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}

