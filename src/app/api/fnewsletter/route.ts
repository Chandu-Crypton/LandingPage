import { NextRequest, NextResponse } from "next/server";
import FNewsLetter from "@/models/FNewsLetter";

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
        const docs = await FNewsLetter.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Newsletter document found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/fnewsletter error:', error);
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
            subject,
            message
        } = body;


        if (!subject || typeof subject !== 'string' ||
            !message || typeof message !== 'string')  {
            return NextResponse.json(
                { success: false, message: 'Newsletter content is required.' },
                { status: 400, headers: corsHeaders }
            );
        }

      
       
        const newEntry = await FNewsLetter.create({
            subject,
            message
        });
    

        return NextResponse.json(
            { success: true, data: newEntry, message: 'FNewsletter content created successfully.' },
            { status: 201, headers: corsHeaders }
        );
    } catch (error: unknown) {
        console.error('POST /api/fnewsletter error:', error);
        return NextResponse.json(
            { success: false, message: (error as Error).message || 'Internal Server Error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
