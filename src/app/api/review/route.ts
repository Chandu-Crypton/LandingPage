import { NextRequest, NextResponse } from "next/server";
import Review from "@/models/Review";
import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";
import { v4 as uuidv4 } from 'uuid';

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
        const docs = await Review.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No review documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/review error:', error);
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
        const title = formData.get('title');
        const icon = formData.get('icon');
        const rating = formData.get('rating');
        const description = formData.get('description');
        const subtitle = formData.get('subtitle');
       
        if (typeof title !== 'string' || !title.trim() ||
            typeof description !== 'string' || !description.trim() ||
            typeof subtitle !== 'string' || !subtitle.trim() ||
             typeof rating !== 'string' || !rating.trim()
          ) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid data for title, description, subtitle or rating.' },
                { status: 400, headers: corsHeaders }
            );
        }

        let iconUrl = '';
        if (icon instanceof File && icon.size > 0) {
            const buffer = Buffer.from(await icon.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${icon.name}`,
                folder: '/review-main-images',
            });
            if (uploadResponse.url) {
                iconUrl = uploadResponse.url;
            } else {
                return NextResponse.json(
                    { success: false, message: 'Failed to upload main image to ImageKit.' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else {
            return NextResponse.json(
                { success: false, message: 'Main Image file is required and must not be empty.' },
                { status: 400, headers: corsHeaders }
            );
        }

       



        const newEntry = await Review.create({
            title: title as string,
            icon: iconUrl,
            rating: rating as string,
            description: description as string,
            subtitle: subtitle as string
   
        });

        return NextResponse.json(
            { success: true, data: newEntry, message: 'Review entry created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/review error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
