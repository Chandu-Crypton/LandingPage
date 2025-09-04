import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import FServices, {IFServices} from '@/models/FServices';
import mongoose from 'mongoose';
import imagekit from '@/utils/imagekit';
import { v4 as uuidv4 } from 'uuid';

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
     
        const fservices = await FServices.findById(id);

        if (!fservices) {
            return NextResponse.json(
                { success: false, message: 'FServices not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: fservices, message: 'FServices fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/fservices/[id] error:', error);
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
        const updateData: Partial<IFServices>  = {};

        const title = formData.get('title');
        const videoLink = formData.get('videoLink');
        const description = formData.get('description');


        if (title && typeof title === 'string') updateData.title = title;
        if (description && typeof description === 'string') updateData.description = description;
        if (videoLink && typeof videoLink === 'string') updateData.videoLink = videoLink;

        const mainImageFile = formData.get("mainImage");
                if (mainImageFile instanceof File && mainImageFile.size > 0) {
                    const buffer = Buffer.from(await mainImageFile.arrayBuffer());
                    const uploadRes = await imagekit.upload({
                        file: buffer,
                        fileName: `${uuidv4()}-${mainImageFile.name}`,
                        folder: "/fservices_images",
                    });
                    updateData.mainImage = uploadRes.url;
                } else if (mainImageFile === "null" || mainImageFile === "") {
                    updateData.mainImage = "";
                }
        

        const updatedFServicesEntry = await FServices.findByIdAndUpdate(
            id,
            { $set: updateData }, // Use $set to update only specified fields
            { new: true, runValidators: true } // Return the updated document, run schema validators
        ).lean(); // Use .lean() for plain object response

        if (!updatedFServicesEntry) {
            return NextResponse.json(
                { success: false, message: 'FServices entry not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedFServicesEntry as IFServices, message: 'FServices entry updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/fservices/[id] error:', error);
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

        const fServicesToDelete = await FServices.findById(id);

        if (!fServicesToDelete) {
            return NextResponse.json(
                { success: false, message: 'FServices not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        const deletedFServices = await FServices.findByIdAndDelete(id);

        if (!deletedFServices) {
            // This check might be redundant if fServicesToDelete already confirmed existence,
            // but keeps the pattern consistent for robustness.
            return NextResponse.json(
                { success: false, message: 'FServices could not be deleted (might have been removed already).' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: deletedFServices, message: 'FServices deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('DELETE /api/fservices/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}