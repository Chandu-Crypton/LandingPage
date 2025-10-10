import { NextRequest, NextResponse } from "next/server";
import VacancyCount from "@/models/VacancyCount";
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
        const docs = await VacancyCount.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No about documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/about error:', error);
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
        const formData = await req.formData();
        console.log('Received formData:', formData);
        const vacancyRoles = formData.get('vacancyRoles');
        const countRoles = formData.get('countRoles');
       
        if (typeof vacancyRoles !== 'string') {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid data' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Check if an entry with the same vacancyRoles already exists
        const existingEntry = await VacancyCount.findOne({ vacancyRoles });

        let result;
        let message;

        if (existingEntry) {
            // Update the existing entry
            result = await VacancyCount.findByIdAndUpdate(
                existingEntry._id,
                {
                    countRoles,
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            );
            message = 'VacancyCount entry updated successfully.';
        } else {
            // Create a new entry
            result = await VacancyCount.create({
                vacancyRoles: vacancyRoles as string,
                countRoles,
            });
            message = 'VacancyCount entry created successfully.';
        }

        return NextResponse.json(
            { 
                success: true, 
                data: result, 
                message,
                action: existingEntry ? 'updated' : 'created'
            },
            { status: existingEntry ? 200 : 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/vacancycount error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}