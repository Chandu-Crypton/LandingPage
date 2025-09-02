import { NextRequest, NextResponse } from "next/server";
import ServiceModel from "@/models/Service";
import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";
import mongoose from "mongoose";

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

        const docs = await ServiceModel.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Service documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }


        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/service error:', error);
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
        console.log("Form Data:",formData)

        const title = formData.get('title')?.toString();
        const descriptionString = formData.get('description')?.toString();
        const mainImageFile = formData.get('mainImage') as File | null;

        const description: string[] = descriptionString ? JSON.parse(descriptionString) : [];
        
         let mainImageUrl: string | undefined;
        if (mainImageFile && mainImageFile.size > 0) {
            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer, // Required
                fileName: mainImageFile.name, // Required
                folder: '/service_images', // Optional, good for organization
            });
            mainImageUrl = uploadRes.url; // ImageKit public URL
        }

        // Basic validation for REQUIRED fields
        if ( !title ||  description.length === 0 || !mainImageFile ) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields (title, description, mainImage).' },
                { status: 400, headers: corsHeaders }
            );
        }

       
      

        const newService = await ServiceModel.create({
            title,
            description,
            mainImage: mainImageUrl
        });

        return NextResponse.json(
            { success: true, data: newService, message: 'Service created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/service error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(err => (err as mongoose.Error.ValidatorError).message);
            return NextResponse.json(
                { success: false, message: 'Validation failed: ' + errors.join(', ') },
                { status: 400, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}