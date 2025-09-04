import { NextRequest, NextResponse } from "next/server";
import FServices from "@/models/FServices";
import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";

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
        const docs = await FServices.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No fservices documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/fservices error:', error);
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

        const title = formData.get('title');
        const mainImageFile = formData.get('mainImage') as File | null;
        const videoLink = formData.get('videoLink');
        const description = formData.get('description');

       
        if (typeof title !== 'string' || !title.trim() ||
            typeof description !== 'string' || !description.trim() ||
            typeof videoLink !== 'string' || !videoLink.trim()
        ) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid data for title, description, or videoLink.' },
                { status: 400, headers: corsHeaders }
            );
        }


       let mainImageUrl: string | undefined;
              if (mainImageFile && mainImageFile.size > 0) {
                  const buffer = Buffer.from(await mainImageFile.arrayBuffer());
                  const uploadRes = await imagekit.upload({
                      file: buffer, // Required
                      fileName: mainImageFile.name, // Required
                      folder: '/fservices_images', // Optional, good for organization
                  });
                  mainImageUrl = uploadRes.url; // ImageKit public URL
              }
      

        const newEntry = await FServices.create({
            title: title as string,
            mainImage: mainImageUrl as string,
            videoLink: videoLink as string,
            description: description as string
        });

        return NextResponse.json(
            { success: true, data: newEntry, message: 'FServices entry created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/fservices error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
