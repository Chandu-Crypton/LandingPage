import { NextRequest, NextResponse } from "next/server";
import Testimonial from "@/models/Testimonial";

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
        const docs = await Testimonial.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No testimonial documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/testimonial error:', error);
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
        console.log("form data:", formData)

        // Fields from formData
        const sectionTitle = formData.get("sectionTitle")?.toString();
        const title = formData.get("title")?.toString();
        const fullName = formData.get("fullName")?.toString();
        const description = formData.get("description")?.toString();
        const rating = formData.get("rating")
            ? Number(formData.get("rating"))
            : undefined;

        const mainImageFile = formData.get("mainImage") as File | null;

        // ✅ Required field validation
        if (!sectionTitle || !title || !fullName || !description) {
            return NextResponse.json(
                { success: false, message: "Missing required fields (sectionTitle, title, fullName, description)." },
                { status: 400, headers: corsHeaders }
            );
        }

        // ✅ Upload image if provided
        let mainImageUrl: string | undefined;
        if (mainImageFile && mainImageFile.size > 0) {
            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: mainImageFile.name,
                folder: "/testimonial_images",
            });
            mainImageUrl = uploadRes.url;
        }

        // ✅ Create new testimonial
        const newTestimonial = await Testimonial.create({
            sectionTitle,
            title,
            fullName,
            description,
            rating,
            mainImage: mainImageUrl,
        });

        return NextResponse.json(
            { success: true, data: newTestimonial, message: "Testimonial created successfully." },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error("POST /api/testimonial error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";

        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(
                (err) => (err as mongoose.Error.ValidatorError).message
            );
            return NextResponse.json(
                { success: false, message: "Validation failed: " + errors.join(", ") },
                { status: 400, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
