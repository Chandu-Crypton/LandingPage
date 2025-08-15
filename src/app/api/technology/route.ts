import { NextRequest, NextResponse } from "next/server";
import Technology from "@/models/Technology";
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
        const docs = await Technology.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No technology documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/technology error:', error);
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

        const fieldName = formData.get('fieldName');
        const iconImage = formData.get('iconImage');
        const technologyName = formData.get('technologyName');
      

        if (typeof fieldName !== 'string' || !fieldName.trim() ||
            typeof technologyName !== 'string' || !technologyName.trim() ||
            !iconImage || !(iconImage instanceof File) || iconImage.size === 0
        ) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid data for fieldName, technologyname, or iconImage.' },
                { status: 400, headers: corsHeaders }
            );
        }

        let iconImageUrl = '';
        if (iconImage && iconImage instanceof File && iconImage.size > 0) {
            const buffer = Buffer.from(await iconImage.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${iconImage.name}`,
                folder: '/blog-main-images',
            });
            if (uploadResponse.url) {
                iconImageUrl = uploadResponse.url;
            } else {
                return NextResponse.json(
                    { success: false, message: 'Failed to upload icon image to ImageKit.' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else {
            return NextResponse.json(
                { success: false, message: 'Main Image file is required and must not be empty.' },
                { status: 400, headers: corsHeaders }
            );
        }



        const newEntry = await Technology.create({
            fieldName: fieldName as string,
            iconImage: iconImageUrl,
            technologyName: technologyName as string
        });

        return NextResponse.json(
            { success: true, data: newEntry, message: 'Technology entry created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/technology error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
