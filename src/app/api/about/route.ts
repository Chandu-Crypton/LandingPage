import { NextRequest, NextResponse } from "next/server";
import About from "@/models/About";
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
        const docs = await About.find({});

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
        const title = formData.get('title');
        const mainImage = formData.get('mainImage');
        const bannerImage = formData.get('bannerImage');
        const descriptionString = formData.get("description")?.toString();
        const description: string[] = descriptionString ? JSON.parse(descriptionString) : [];
        const typeData = formData.get('typeData');
       
        if (typeof title !== 'string' || !title.trim() ||
             description.length === 0 ||
            typeof typeData !== 'string' || !typeData.trim()
          ) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid data for title, description, or typeData.' },
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

        let bannerImageUrl = '';
        if (bannerImage instanceof File && bannerImage.size > 0) {
            const buffer = Buffer.from(await bannerImage.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${bannerImage.name}`,
                folder: '/about-banner-images',

            });
            if (uploadResponse.url) {
                bannerImageUrl = uploadResponse.url;
            } else {
                return NextResponse.json(
                    { success: false, message: 'Failed to upload banner image to ImageKit.' },
                    { status: 500, headers: corsHeaders }
                );
            }
        }



        const newEntry = await About.create({
            title: title as string,
            mainImage: mainImageUrl,
            bannerImage: bannerImageUrl,
            description,
            typeData: typeData as string
   
        });

        return NextResponse.json(
            { success: true, data: newEntry, message: 'About entry created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/about error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
