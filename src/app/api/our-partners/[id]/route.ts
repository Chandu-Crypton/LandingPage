import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import OurPartners, { IOurPartners } from '@/models/Our-Partners'; // Import your OurPartners model
import imagekit from '@/utils/imagekit';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is used for file names
import mongoose from 'mongoose';

// IMPORTANT: Define or import these as per your project setup
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};


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
     
        const about = await OurPartners.findById(id);

        if (!about) {
            return NextResponse.json(
                { success: false, message: 'OurPartners not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: about, message: 'OurPartners fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/our-partners/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}






export async function PUT(req: Request) {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

   

    try {
       

        const formData = await req.formData();

        // Corrected: Allow string indexing on updateData for dynamic assignments
        const updateData: Partial<IOurPartners> & { [key: string]: string | string[] } = {};

        const title = formData.get('title');
        const mainImage = formData.get('mainImage');

    
        if (title && typeof title === 'string') updateData.title = title;
      
        // Handle mainImage file upload or URL
        if (mainImage) { // Check if the mainImage field was provided at all
            if (mainImage instanceof File) {
                if (mainImage.size > 0) {
                    const buffer = Buffer.from(await mainImage.arrayBuffer());
                    const uploadResponse = await imagekit.upload({
                        file: buffer,
                        fileName: `${uuidv4()}-${mainImage.name}`,
                        folder: '/about-main-images',
                    });
                    if (uploadResponse.url) {
                        updateData.mainImage = uploadResponse.url;
                    } else {
                        return NextResponse.json(
                            { success: false, message: 'Failed to upload new main image to ImageKit.' },
                            { status: 500, headers: corsHeaders }
                        );
                    }
                } else {
                    // Empty file upload, means remove existing image
                    updateData.mainImage = '';
                    // OPTIONAL: Consider deleting the old image file from ImageKit here
                }
            } else if (typeof mainImage === 'string' && mainImage.trim()) {
                // If it's a string, treat it as a URL
                updateData.mainImage = mainImage.trim();
            } else if (mainImage === '') { // Explicitly sent empty string, means clear
                updateData.mainImage = '';
                // OPTIONAL: Consider deleting the old image file from ImageKit here
            }
        }
      



        const updatedOurPartnersEntry = await OurPartners.findByIdAndUpdate(
            id,
            { $set: updateData }, // Use $set to update only specified fields
            { new: true, runValidators: true } // Return the updated document, run schema validators
        ).lean(); // Use .lean() for plain object response

        if (!updatedOurPartnersEntry) {
            return NextResponse.json(
                { success: false, message: 'OurPartners entry not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedOurPartnersEntry as IOurPartners, message: 'OurPartners entry updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/our-partners/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}



export async function DELETE(req: NextRequest) {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {

        const ourPartnersToDelete = await OurPartners.findById(id);

        if (!ourPartnersToDelete) {
            return NextResponse.json(
                { success: false, message: 'OurPartners not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

     

        const deletedOurPartners = await OurPartners.findByIdAndDelete(id);

        if (!deletedOurPartners) {
            // This check might be redundant if ourPartnersToDelete already confirmed existence,
            // but keeps the pattern consistent for robustness.
            return NextResponse.json(
                { success: false, message: 'OurPartners could not be deleted (might have been removed already).' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: deletedOurPartners, message: 'OurPartners deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('DELETE /api/our-partners/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}