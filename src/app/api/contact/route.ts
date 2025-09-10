import { NextRequest, NextResponse } from "next/server";
import Contact from "@/models/Contact";
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
        const docs = await Contact.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Contact document found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/contact error:', error);
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
        const body = await req.json();

        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            message
        } = body;


        if (!firstName || typeof firstName !== 'string' ||
            !lastName || typeof lastName !== 'string' ||
            !email || typeof email !== 'string' ||
            !phoneNumber || typeof phoneNumber !== 'string' ||
            !message || typeof message !== 'string') {
            return NextResponse.json(
                { success: false, message: 'Contact information is required.' },
                { status: 400, headers: corsHeaders }
            );
        }



        const phoneNumberAsNumber = Number(phoneNumber);
        if (isNaN(phoneNumberAsNumber)) {
            return NextResponse.json(
                { success: false, message: 'Phone number must be a valid number.' },
                { status: 400, headers: corsHeaders }
            );
        }



        // If no document exists, create a new one
        const newEntry = await Contact.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            message
        });


        return NextResponse.json(
            { success: true, data: newEntry, message: 'FContact created successfully.' },
            { status: 201, headers: corsHeaders }
        );
    } catch (error: unknown) {
        console.error('POST /api/fcontact error:', error);
        return NextResponse.json(
            { success: false, message: (error as Error).message || 'Internal Server Error' },
            { status: 500, headers: corsHeaders }
        );
    }
}

