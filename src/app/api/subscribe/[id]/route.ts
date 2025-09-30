import { NextRequest, NextResponse } from "next/server";
import Subscribe from "@/models/SubscribeNews";
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose"; // Import mongoose to check for valid ObjectId

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ISubscribe {
   
    email: string;
   
}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const doc = await Subscribe.findById(id);

        if (!doc) {
            return NextResponse.json(
                { success: false, message: 'Subscribe document not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: doc },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/subscribe error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
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
        console.log("PUT /api/subscribe body:", body);
        const updateData: Partial<ISubscribe> = {};
        // Validate and assign fields if present in the request body
        
        if (body.email !== undefined && typeof body.email === 'string') {
            updateData.email = body.email;
        }

      

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No valid fields provided for update.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedDoc = await Subscribe.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            return NextResponse.json(
                { success: false, message: 'Subscribe document not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedDoc, message: 'Subscribe content updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`PUT /api/subscribe/${id} error:`, error);
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
        const deletedDoc = await Subscribe.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Subscribe document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Subscribe document deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/subscribe/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}