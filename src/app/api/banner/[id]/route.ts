import { NextRequest, NextResponse } from "next/server";
import Banner from "@/models/Banner";
import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";
import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing about ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
     
        const banner = await Banner.findById(id);

        if (!banner) {
            return NextResponse.json(
                { success: false, message: 'Banner not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: banner, message: 'Banner fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/banner/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}



// PUT route for updating a banner
export async function PUT(req: NextRequest) {
    await connectToDatabase();

    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop(); // Extract ID from URL
        
        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Banner ID is required.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const formData = await req.formData();
        const title = formData.get('title');
        const bannerImage = formData.get('bannerImage');
       

        // Find the existing banner
        const existingBanner = await Banner.findById(id);
        if (!existingBanner) {
            return NextResponse.json(
                { success: false, message: 'Banner not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        // Prepare update data
     const updateData: { title?: string; bannerImage?: string } = {};
        
        if (typeof title === 'string' && title.trim()) {
            updateData.title = title;
        }
        
        
        // Handle banner image upload if provided
        if (bannerImage instanceof File && bannerImage.size > 0) {
            const buffer = Buffer.from(await bannerImage.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${bannerImage.name}`,
                folder: '/banner-images',
            });
            
            if (uploadResponse.url) {
                updateData.bannerImage = uploadResponse.url;
                
                // Optionally delete the old image from ImageKit
                // You might want to extract the file ID from the existing URL
                // and delete it from ImageKit here
            } else {
                return NextResponse.json(
                    { success: false, message: 'Failed to upload banner image to ImageKit.' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else if (bannerImage === '') {
            // If bannerImage is explicitly set to empty string, remove it
            updateData.bannerImage = '';
        }

        // Update the banner
        const updatedBanner = await Banner.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return NextResponse.json(
            { 
                success: true, 
                data: updatedBanner, 
                message: 'Banner updated successfully.' 
            },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/banner error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}

// DELETE route for removing a banner
export async function DELETE(req: NextRequest) {
    await connectToDatabase();

    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop(); // Extract ID from URL
        
        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Banner ID is required.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Find and delete the banner
        const deletedBanner = await Banner.findByIdAndDelete(id);
        
        if (!deletedBanner) {
            return NextResponse.json(
                { success: false, message: 'Banner not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        

        return NextResponse.json(
            { 
                success: true, 
                message: 'Banner deleted successfully.',
                data: deletedBanner
            },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('DELETE /api/banner error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}