import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Gallery, { IGallery } from '@/models/Gallery'; // Import your About model
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
     
        const about = await Gallery.findById(id);

        if (!about) {
            return NextResponse.json(
                { success: false, message: 'Gallery not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: about, message: 'Gallery fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/gallery/[id] error:', error);
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
        const updateData: Partial<IGallery> & { [key: string]: string | string[] } = {};

        const title = formData.get('title');
        const mainImage = formData.get('mainImage');
       const category = formData.get('category');

        if (title && typeof title === 'string') updateData.title = title;
        if (category && typeof category === 'string') updateData.category = category;
      

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
   
        const updatedAboutEntry = await Gallery.findByIdAndUpdate(
            id,
            { $set: updateData }, // Use $set to update only specified fields
            { new: true, runValidators: true } // Return the updated document, run schema validators
        ).lean(); // Use .lean() for plain object response

        if (!updatedAboutEntry) {
            return NextResponse.json(
                { success: false, message: 'Gallery entry not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedAboutEntry as IGallery, message: 'Gallery entry updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/gallery/[id] error:', error);
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
       
        const galleryToDelete = await Gallery.findById(id);

        if (!galleryToDelete) {
            return NextResponse.json(
                { success: false, message: 'Gallery not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

     

        const deletedGallery = await Gallery.findByIdAndDelete(id);

        if (!deletedGallery) {
            // This check might be redundant if blogToDelete already confirmed existence,
            // but keeps the pattern consistent for robustness.
            return NextResponse.json(
                { success: false, message: 'Gallery could not be deleted (might have been removed already).' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: deletedGallery, message: 'About deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('DELETE /api/gallery/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}