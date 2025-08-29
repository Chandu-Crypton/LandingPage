import { NextRequest, NextResponse } from "next/server";
import Technology from "@/models/Technology";
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


export async function GET() {
    await connectToDatabase();

    try {
        const docs = await Technology.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No technology documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/technology error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}





// POST handler to create a new technology entry
export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const formData = await req.formData();
        const addFieldName = formData.get('addFieldName')?.toString();
        const fieldName = formData.get('fieldName')?.toString();
        // Expect JSON string for array of technology items
        const technologyNameJson = formData.get('technologyNameJson')?.toString(); 

        // 1. Validate fieldName
        if (!fieldName || fieldName.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Field Name is required.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // 2. Parse and validate technologyName array
        let technologyName: { title: string; iconImage: string; }[] = [];
        if (technologyNameJson) {
            try {
                const parsedTechName = JSON.parse(technologyNameJson);
                if (Array.isArray(parsedTechName)) {
                    technologyName = parsedTechName.map((item: { title: string; iconImage: string; }) => ({
                        title: String(item.title || '').trim(),
                        iconImage: String(item.iconImage || '').trim() // This might be an existing URL or empty if a new file is uploaded
                    }));
                } else {
                     return NextResponse.json(
                        { success: false, message: 'Invalid JSON format for technologyName: Expected an array.' },
                        { status: 400, headers: corsHeaders }
                    );
                }
            } catch (jsonError) {
                console.error("Failed to parse technologyNameJson:", jsonError);
                return NextResponse.json(
                    { success: false, message: 'Invalid JSON format for technologyName.' },
                    { status: 400, headers: corsHeaders }
                );
            }
        }

        // 3. Final validation on the parsed technologyName array
        if (technologyName.length === 0) {
            return NextResponse.json(
                { success: false, message: 'At least one technology entry is required (with title and icon).' },
                { status: 400, headers: corsHeaders }
            );
        }
        
        // Process each technology entry, handle iconImage uploads
        const processedTechnologyName = [];
        for (let i = 0; i < technologyName.length; i++) {
            const item = technologyName[i];
            const iconImageFile = formData.get(`iconImage_${i}`) as File | null; // Get file by specific key

            let imageUrl = item.iconImage; // Default to existing URL or empty string from parsed JSON

            // Validate that the title is not empty for any item
            if (item.title.trim() === '') {
                return NextResponse.json(
                    { success: false, message: `Technology title is required for entry ${i + 1}.` },
                    { status: 400, headers: corsHeaders }
                );
            }

            if (iconImageFile && iconImageFile.size > 0) {
                // Upload new image file to ImageKit
                try {
                    const buffer = Buffer.from(await iconImageFile.arrayBuffer());
                    const uploadRes = await imagekit.upload({
                        file: buffer,
                        fileName: `${uuidv4()}-${iconImageFile.name}`,
                        folder: '/technology-icons', // Organize your icons
                    });
                    imageUrl = uploadRes.url; // Get ImageKit public URL
                } catch (uploadError) {
                    console.error(`Error uploading icon for item ${i}:`, uploadError);
                    return NextResponse.json(
                        { success: false, message: `Failed to upload icon for "${item.title}".` },
                        { status: 500, headers: corsHeaders }
                    );
                }
            } else if (!imageUrl) { // If no file and no URL, it's an error (icon is required)
                return NextResponse.json(
                    { success: false, message: `Icon image is required for technology "${item.title}".` },
                    { status: 400, headers: corsHeaders }
                );
            }
            
            processedTechnologyName.push({
                title: item.title.trim(), // Ensure title is trimmed
                iconImage: imageUrl,
            });
        }

        const newEntry = await Technology.create({
            addFieldName: addFieldName?.trim(),
            fieldName: fieldName.trim(),
            technologyName: processedTechnologyName,
        });

        return NextResponse.json(
            { success: true, data: newEntry, message: 'Technology entry created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/technology error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        if (error instanceof mongoose.Error.ValidationError) {
            // Map validation errors to their messages for a clearer response
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