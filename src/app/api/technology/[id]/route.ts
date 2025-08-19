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



     


// // PUT handler to update an existing technology entry
// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) { // <-- Corrected signature here
//     await connectToDatabase();
//     try {
//         const { id } = params; // Now 'id' will be correctly destructured from 'params'

//         if (!id) {
//             return NextResponse.json(
//                 { success: false, message: 'Technology ID is required for update.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return NextResponse.json(
//                 { success: false, message: 'Invalid Technology ID format.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

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
        const updateData: Partial<ITechnology> = {};

        // Fetch existing technology to merge with update data and manage image deletions
        const existingTechnology = await Technology.findById(id); // Using Technology consistent with the file
        if (!existingTechnology) {
            return NextResponse.json(
                { success: false, message: 'Technology not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        // Process fieldName if provided in formData
        if (formData.has('fieldName')) {
            const fieldName = formData.get('fieldName')?.toString();
            if (!fieldName || fieldName.trim() === '') {
                return NextResponse.json(
                    { success: false, message: 'Field Name cannot be empty if provided.' },
                    { status: 400, headers: corsHeaders }
                );
            }
            updateData.fieldName = fieldName.trim();
        }

        // Process technologyName if provided in formData
        if (formData.has('technologyNameJson')) {
            const technologyNameJson = formData.get('technologyNameJson')?.toString();
            let technologyName: { title: string; iconImage: string; }[] = [];

            if (technologyNameJson) {
                try {
                    const parsedTechName = JSON.parse(technologyNameJson);
                    if (Array.isArray(parsedTechName)) {
                        technologyName = parsedTechName.map((item: { title: string; iconImage: string; }) => ({
                            title: String(item.title || '').trim(),
                            iconImage: String(item.iconImage || '').trim()
                        }));
                    } else {
                        return NextResponse.json(
                            { success: false, message: 'Invalid JSON format for technologyName: Expected an array.' },
                            { status: 400, headers: corsHeaders }
                        );
                    }
                } catch (jsonError) {
                    console.error("Failed to parse technologyNameJson for update:", jsonError);
                    return NextResponse.json(
                        { success: false, message: 'Invalid JSON format for technologyName during update.' },
                        { status: 400, headers: corsHeaders }
                    );
                }
            } else { // if technologyNameJson is empty string or null, it means frontend wants to clear all technologies
                updateData.technologyName = [];
            }
            
            const oldImagekitFileIdsToDelete: string[] = [];
            const processedTechnologyName: { title: string; iconImage: string; }[] = [];

            // If technologyNameJson was provided, iterate through the parsed data
            for (let i = 0; i < technologyName.length; i++) {
                const item = technologyName[i];
                const iconImageFile = formData.get(`iconImage_${i}`) as File | null;

                let imageUrl = item.iconImage; // Starts as the URL from frontend (could be old or empty)

                // Validate that the title is not empty for any item if it's being sent
                if (item.title.trim() === '') {
                    return NextResponse.json(
                        { success: false, message: `Technology title is required for entry ${i + 1}.` },
                        { status: 400, headers: corsHeaders }
                    );
                }

                if (iconImageFile && iconImageFile.size > 0) {
                    // New file uploaded: delete old image if exists
                    const existingItem = existingTechnology.technologyName[i];
                    if (existingItem && existingItem.iconImage) {
                        const fileId = existingItem.iconImage.split('/').pop()?.split('__')[0];
                        if (fileId) {
                            oldImagekitFileIdsToDelete.push(fileId);
                        }
                    }
                    // Upload new image
                    try {
                        const buffer = Buffer.from(await iconImageFile.arrayBuffer());
                        const uploadRes = await imagekit.upload({
                            file: buffer,
                            fileName: `${uuidv4()}-${iconImageFile.name}`,
                            folder: '/technology-icons',
                        });
                        imageUrl = uploadRes.url;
                    } catch (uploadError) {
                        console.error(`Error uploading new icon for item ${i}:`, uploadError);
                        return NextResponse.json(
                            { success: false, message: `Failed to upload new icon for "${item.title}".` },
                            { status: 500, headers: corsHeaders }
                        );
                    }
                } else if (!imageUrl && item.title.trim() !== '') { // If no new file and no URL, but title exists, it's an error (icon is required)
                    return NextResponse.json(
                        { success: false, message: `Icon image is required for technology "${item.title}".` },
                        { status: 400, headers: corsHeaders }
                    );
                } else if (item.iconImage && existingTechnology.technologyName[i]?.iconImage && item.iconImage !== existingTechnology.technologyName[i]?.iconImage) {
                    // If the URL was changed (e.g., cleared on frontend for an existing item), delete the old one
                    const existingItem = existingTechnology.technologyName[i];
                    if (existingItem && existingItem.iconImage) {
                        const fileId = existingItem.iconImage.split('/').pop()?.split('__')[0];
                        if (fileId) {
                            oldImagekitFileIdsToDelete.push(fileId);
                        }
                    }
                }
                
                processedTechnologyName.push({
                    title: item.title.trim(),
                    iconImage: imageUrl,
                });
            }

            // Delete old ImageKit files after processing all updates
            for (const fileId of oldImagekitFileIdsToDelete) {
                try {
                    await imagekit.deleteFile(fileId);
                } catch (deleteError) {
                    console.error(`Error deleting old ImageKit file ${fileId}:`, deleteError);
                }
            }
            updateData.technologyName = processedTechnologyName.filter(item => item.title.trim() !== '' || item.iconImage.trim() !== '');
        }

        // Check if updateData is empty after processing, if so, nothing to update
        if (Object.keys(updateData).length === 0) {
             return NextResponse.json(
                { success: false, message: 'No fields provided for update.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedTechnology = await Technology.findByIdAndUpdate( // Using Technology consistent with the file
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedTechnology) {
            return NextResponse.json(
                { success: false, message: 'Technology not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedTechnology as ITechnology, message: 'Technology updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/technology/:id error:', error);
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