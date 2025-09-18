import { NextRequest, NextResponse } from "next/server";
import OurPartners from "@/models/Our-Partners";
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
        const docs = await OurPartners.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No our partners documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/our-partners error:', error);
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
      
        if (typeof title !== 'string' || !title.trim() 
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

       
      



        const newEntry = await OurPartners.create({
            title: title as string,
            mainImage: mainImageUrl,
           
   
        });

        return NextResponse.json(
            { success: true, data: newEntry, message: 'Our Partners entry created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/our-partners error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
