import { NextRequest, NextResponse } from "next/server";
import Internship from "@/models/Internship";
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

        const docs = await Internship.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Blog documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }


        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/blog error:', error);
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
        console.log("Received form data:", formData);
        const subtitle = formData.get('subtitle')?.toString() || undefined; // Optional
        const mode = formData.get('mode')?.toString();
        const title = formData.get('title')?.toString();
        const description = formData.get('description')?.toString();
        const fee = formData.get('fee')?.toString();
        const duration = formData.get('duration')?.toString();
        const mainImageFile = formData.get('mainImage') as File | null;
        const bannerImageFile = formData.get('bannerImage') as File | null;
   
       const parseField = (fieldValue: string | null): string[] => {
  if (!fieldValue) return [];

  try {
    const parsed = JSON.parse(fieldValue);

    if (Array.isArray(parsed)) {
      return parsed; // valid array
    }

    if (typeof parsed === "string") {
      return [parsed]; // JSON string
    }

    return [];
  } catch {
    // Not JSON, treat as plain string
    return [fieldValue];
  }
};

const benefits = parseField(formData.get("benefits")?.toString() || null);
const eligibility = parseField(formData.get("eligibility")?.toString() || null);





        // Basic validation for REQUIRED fields
        if (!subtitle || !title || !description || !mode ||  benefits.length === 0 || !fee || !duration || (eligibility.length === 0)) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields (blogHeading, title, description, category, tags, keyTechnologies, or items).' },
                { status: 400, headers: corsHeaders }
            );
        }

        let mainImageUrl: string | undefined;
        if (mainImageFile && mainImageFile.size > 0) {
            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer, // Required
                fileName: mainImageFile.name, // Required
                folder: '/internshipmain_images', // Optional, good for organization
            });
            mainImageUrl = uploadRes.url; // ImageKit public URL
        }

        let bannerImageUrl: string | undefined;
        if (bannerImageFile && bannerImageFile.size > 0) {
            const buffer = Buffer.from(await bannerImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer, // Required
                fileName: bannerImageFile.name, // Required
                folder: '/internshipbanner_images', // Optional, good for organization
            });
            bannerImageUrl = uploadRes.url; // ImageKit public URL
        }
        

        const newBlog = await Internship.create({
            subtitle,
            fee,
            title,
            benefits,
            duration,
            eligibility,
            mode,
            description,
            mainImage: mainImageUrl,
            bannerImage: bannerImageUrl,
        });

        return NextResponse.json(
            { success: true, data: newBlog, message: 'Internship created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/internship error:', error);
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