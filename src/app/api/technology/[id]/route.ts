import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Technology, { ITechnology } from '@/models/Technology'; // Import your Technology model
import imagekit from '@/utils/imagekit';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is used for file names
import mongoose from 'mongoose';


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};


export async function GET(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing Technology ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {

        const technology = await Technology.findById(id);

        if (!technology) {
            return NextResponse.json(
                { success: false, message: 'Technology not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: technology, message: 'Technology fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/technology/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}


export async function PUT(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing Technology ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {

        const formData = await req.formData();
        const fieldName = formData.get('fieldName');
        const iconImage = formData.get('iconImage');
        const technologyName = formData.get('technologyName');

        const updateData: Partial<ITechnology> = {};
        if (fieldName && typeof fieldName === 'string') updateData.fieldName = fieldName;
        if (technologyName && typeof technologyName === 'string') updateData.technologyName = technologyName;

        if (iconImage && iconImage instanceof File) {
            const buffer = Buffer.from(await iconImage.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${iconImage.name}`,
                folder: '/technology-icons',
            });
            if (uploadResponse.url) {
                updateData.iconImage = uploadResponse.url;
            } else {
                return NextResponse.json(
                    { success: false, message: 'Failed to upload new icon image to ImageKit.' },
                    { status: 500, headers: corsHeaders }
                );
            }
        }

        // Find and update the technology entry
        const updatedTechnology = await Technology.findByIdAndUpdate(
            id,
            { $set: updateData }, // Use $set to update only specified fields
            { new: true, runValidators: true } // Return the updated document, run schema validators
        );

        if (!updatedTechnology) {
            return NextResponse.json(
                { success: false, message: 'Technology not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedTechnology, message: 'Technology updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/technology/[id] error:', error);
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

        const techToDelete = await Technology.findById(id);

        if (!techToDelete) {
            return NextResponse.json(
                { success: false, message: 'Technology not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

     
        const deletedAbout = await Technology.findByIdAndDelete(id);

        if (!deletedAbout) {
        
            return NextResponse.json(
                { success: false, message: 'Technology could not be deleted (might have been removed already).' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: deletedAbout, message: 'Technology deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('DELETE /api/technology/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}