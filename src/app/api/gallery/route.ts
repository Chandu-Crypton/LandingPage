import { NextRequest, NextResponse } from "next/server";
import Gallery from "@/models/Gallery";
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
        const docs = await Gallery.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No gallery documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/gallery error:', error);
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
        console.log("Form Data: ", formData)
        console.log('Received formData:', formData);
        const category = formData.get('category');
        const title = formData.get('title');
        const mainImage = formData.get('mainImage');
        
       
        if (typeof title !== 'string' || !title.trim() ||
            typeof category !== 'string' || !category.trim() 
          ) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid data for title, category' },
                { status: 400, headers: corsHeaders }
            );
        }

        let mainImageUrl = '';
        if (mainImage instanceof File && mainImage.size > 0) {
            const buffer = Buffer.from(await mainImage.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${mainImage.name}`,
                folder: '/about-main-images',
            });
            if (uploadResponse.url) {
                mainImageUrl = uploadResponse.url;
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

        const newEntry = await Gallery.create({
            category,
            title: title as string,
            mainImage: mainImageUrl,
        });

        return NextResponse.json(
            { success: true, data: newEntry, message: 'Gallery entry created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/gallery error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
