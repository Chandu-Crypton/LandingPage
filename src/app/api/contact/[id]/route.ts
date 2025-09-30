import { NextRequest, NextResponse } from "next/server";
import Contact from "@/models/Contact";
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose"; // Import mongoose to check for valid ObjectId

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface IContact {
    firstName?: string;
    // lastName?: string;
    email?: string;
    phoneNumber?: number;
  
    message?: string;
}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const doc = await Contact.findById(id);

        if (!doc) {
            return NextResponse.json(
                { success: false, message: 'Contact document not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: doc },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/contact error:', error);
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
        console.log("PUT /api/contact body:", body);
        const updateData: Partial<IContact> = {};
        // Validate and assign fields if present in the request body
        if (body.phoneNumber !== undefined) {
            const phoneNumberAsNumber = Number(body.phoneNumber);
            if (isNaN(phoneNumberAsNumber) || typeof phoneNumberAsNumber !== 'number') {
                return NextResponse.json(
                    { success: false, message: 'Phone number must be a valid number.' },
                    { status: 400, headers: corsHeaders }
                );
            }
            updateData.phoneNumber = phoneNumberAsNumber;
        }
        if (body.email !== undefined && typeof body.email === 'string') {
            updateData.email = body.email;
        }

        if (body.message !== undefined && typeof body.message === 'string') {
            updateData.message = body.message;
        }
        if (body.firstName !== undefined && typeof body.firstName === 'string') {
            updateData.firstName = body.firstName;
        }
        // if (body.lastName !== undefined && typeof body.lastName === 'string') {
        //     updateData.lastName = body.lastName;
        // }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No valid fields provided for update.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedDoc = await Contact.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            return NextResponse.json(
                { success: false, message: 'FContact document not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedDoc, message: 'FContact content updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`PUT /api/contact/${id} error:`, error);
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
        const deletedDoc = await Contact.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'FContact document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'FContact document deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/contact/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}