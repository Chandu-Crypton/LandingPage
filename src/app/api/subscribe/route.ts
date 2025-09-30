import { NextRequest, NextResponse } from "next/server";
import Subscribe from "@/models/SubscribeNews";
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
        const docs = await Subscribe.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Subscribe document found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/subscribe error:', error);
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
            email,
        
        } = body;


        if (
            !email || typeof email !== 'string') {
            return NextResponse.json(
                { success: false, message: 'SSubscribe information is required.' },
                { status: 400, headers: corsHeaders }
            );
        }



       


        // If no document exists, create a new one
        const newEntry = await Subscribe.create({
         
            email,
    
        });


        return NextResponse.json(
            { success: true, data: newEntry, message: 'Subscribe created successfully.' },
            { status: 201, headers: corsHeaders }
        );
    } catch (error: unknown) {
        console.error('POST /api/subscribe error:', error);
        return NextResponse.json(
            { success: false, message: (error as Error).message || 'Internal Server Error' },
            { status: 500, headers: corsHeaders }
        );
    }
}

