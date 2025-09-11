import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Review, { IReview } from '@/models/Review'; // Import your About model
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
     
        const review = await Review.findById(id);

        if (!review) {
            return NextResponse.json(
                { success: false, message: 'Review not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: review, message: 'Review fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/review/[id] error:', error);
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
        const updateData: Partial<IReview> & { [key: string]: string | string[] } = {};

        const title = formData.get('title');
        const icon = formData.get('icon');
        const subtitle = formData.get('subtitle');
        const description = formData.get('description');
        const rating = formData.get('rating'); // Assuming typeData is a string field

        if (title && typeof title === 'string') updateData.title = title;
        if (description && typeof description === 'string') updateData.description = description;
        if (rating && typeof rating === 'string') updateData.rating = rating;
         if (subtitle && typeof subtitle === 'string') updateData.subtitle = subtitle;

        // Handle mainImage file upload or URL
        if (icon) { // Check if the mainImage field was provided at all
            if (icon instanceof File) {
                if (icon.size > 0) {
                    const buffer = Buffer.from(await icon.arrayBuffer());
                    const uploadResponse = await imagekit.upload({
                        file: buffer,
                        fileName: `${uuidv4()}-${icon.name}`,
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
                    updateData.icon = '';
                    // OPTIONAL: Consider deleting the old image file from ImageKit here
                }
            } else if (typeof icon === 'string' && icon.trim()) {
                // If it's a string, treat it as a URL
                updateData.icon = icon.trim();
            } else if (icon === '') { // Explicitly sent empty string, means clear
                updateData.icon = '';
                // OPTIONAL: Consider deleting the old image file from ImageKit here
            }
        }
      

      
        const updatedReviewEntry = await Review.findByIdAndUpdate(
            id,
            { $set: updateData }, // Use $set to update only specified fields
            { new: true, runValidators: true } // Return the updated document, run schema validators
        ).lean(); // Use .lean() for plain object response

        if (!updatedReviewEntry) {
            return NextResponse.json(
                { success: false, message: 'Review entry not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedReviewEntry as IReview, message: 'Review entry updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/review/[id] error:', error);
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
       
        const reviewToDelete = await Review.findById(id);

        if (!reviewToDelete) {
            return NextResponse.json(
                { success: false, message: 'Review not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

     

        const deletedreview = await Review.findByIdAndDelete(id);

        if (!deletedreview) {
            // This check might be redundant if blogToDelete already confirmed existence,
            // but keeps the pattern consistent for robustness.
            return NextResponse.json(
                { success: false, message: 'Review could not be deleted (might have been removed already).' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: deletedreview, message: 'Review deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('DELETE /api/review/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}