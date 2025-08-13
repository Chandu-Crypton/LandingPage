import { NextRequest, NextResponse } from "next/server";
import Footer from "@/models/Footer";

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
        const docs = await Footer.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Footer document found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/footer error:', error);
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
            phone,
            workinghours,
            address,
            socialMediaLinks
        } = body;


        if (!workinghours || typeof workinghours !== 'string' ||
            !address || typeof address !== 'string' ||
            !phone || typeof phone !== 'string' ||
            !socialMediaLinks || !Array.isArray(socialMediaLinks)) {
            return NextResponse.json(
                { success: false, message: 'Footer content is required.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Check if there's an existing document
        const existing = await Footer.findOne();

        if (existing) {
            // Replace the existing content
            existing.phone = phone
            existing.address = address
            existing.workinghours = workinghours
            existing.socialMediaLinks = socialMediaLinks

            await existing.save();

            return NextResponse.json(
                { success: true, data: existing, message: 'Footer content replaced successfully.' },
                { status: 200, headers: corsHeaders }
            );
        }

        // If no document exists, create a new one
        const newEntry = await Footer.create({   
            phone,
            workinghours,
            address,
            socialMediaLinks });

        return NextResponse.json(
            { success: true, data: newEntry, message: 'Footer content created successfully.' },
            { status: 201, headers: corsHeaders }
        );
    } catch (error: unknown) {
        console.error('POST /api/footer error:', error);
        return NextResponse.json(
            { success: false, message: (error as Error).message || 'Internal Server Error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
