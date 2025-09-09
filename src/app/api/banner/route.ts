import { NextRequest, NextResponse } from "next/server";
import Banner from "@/models/Banner";
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
        const docs = await Banner.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No banner documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/banner error:', error);
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
        const bannerImage = formData.get('bannerImage');
       
        if (typeof title !== 'string' || !title.trim()) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid title.' },
                { status: 400, headers: corsHeaders }
            );
        }

        let bannerImageUrl = '';
        if (bannerImage instanceof File && bannerImage.size > 0) {
            const buffer = Buffer.from(await bannerImage.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${bannerImage.name}`,
                folder: '/banner-images',
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

        // Check if a banner with the same title already exists
        const existingBanner = await Banner.findOne({ title: title.trim() });

        let result;
        let message;

        // Define the update data type
        interface UpdateData {
            bannerImage?: string;
            updatedAt?: Date;
        }

        if (existingBanner) {
            // Update existing banner
            const updateData: UpdateData = {
                updatedAt: new Date()
            };
            
            // Only update image if a new one was provided
            if (bannerImageUrl) {
                updateData.bannerImage = bannerImageUrl;
            }
            
            result = await Banner.findByIdAndUpdate(
                existingBanner._id,
                updateData,
                { new: true, runValidators: true }
            );
            message = 'Banner updated successfully.';
        } else {
            // Create new banner
            result = await Banner.create({
                title: title.trim(),
                bannerImage: bannerImageUrl,
            });
            message = 'Banner created successfully.';
        }

        return NextResponse.json(
            { success: true, data: result, message },
            { status: existingBanner ? 200 : 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/banner error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500, headers: corsHeaders }
        );
    }
}