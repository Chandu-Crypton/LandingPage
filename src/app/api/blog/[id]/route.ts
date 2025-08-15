import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Blog, { IBlog } from "@/models/Blog"; // Import your Blog model
import imagekit from "@/utils/imagekit";
import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose"; // Import mongoose to validate ObjectId



const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Added PUT
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const doc = await Blog.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Blog not found.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/blog/${id} error:`, error);
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
            { success: false, message: 'Invalid or missing Blog ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        const formData = await req.formData();
        const updateData: Partial<IBlog> = {}; // Using Partial<IBlog> for type safety

        // Get values from FormData
        const title = formData.get('title');
        const mainImageFile = formData.get('mainImage');
        const headingImageFile = formData.get('headingImage');
        const description = formData.get('description');
        const items = formData.get('items');

        // --- Text Field Validation and Assignment ---
        if (title !== null && typeof title === 'string' && title.trim()) {
            updateData.title = title;
        }
        if (description !== null && typeof description === 'string' && description.trim()) {
            updateData.description = description;
        }

        // --- Corrected Items Parsing and Validation ---
        if (items !== null && typeof items === 'string' && items.trim()) {
            try {
                // Asserting 'items' as string before parsing
                const parsedItems: { itemTitle: string; itemDescription: string; }[] = JSON.parse(items as string);

                // Validate parsedItems structure
                if (Array.isArray(parsedItems) && parsedItems.every(item =>
                    typeof item === 'object' && item !== null &&
                    'itemTitle' in item && typeof item.itemTitle === 'string' && // No 'as any' needed
                    'itemDescription' in item && typeof item.itemDescription === 'string' // No 'as any' needed
                )) {
                    updateData.items = parsedItems;
                } else {
                    return NextResponse.json(
                        { success: false, message: 'Invalid format for "items" field. Expected a JSON array of objects with itemTitle and itemDescription properties.' },
                        { status: 400, headers: corsHeaders }
                    );
                }
            } catch (jsonError) {
                console.error('JSON parsing error for "items":', jsonError);
                const message = jsonError instanceof Error ? jsonError.message : 'Invalid JSON format for "items" field.';
                return NextResponse.json(
                    { success: false, message },
                    { status: 400, headers: corsHeaders }
                );
            }
        }

        // --- Main Image File Upload Logic ---
        if (mainImageFile instanceof File && mainImageFile.size > 0) {
            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${mainImageFile.name}`,
                folder: '/blog-main-images',
            });

            if (uploadResponse.url) {
                updateData.mainImage = uploadResponse.url;
            } else {
                return NextResponse.json(
                    { success: false, message: 'Failed to upload new main image file.' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else if (mainImageFile === 'null' || mainImageFile === '') {
            updateData.mainImage = ''; // Use empty string for string type in Mongoose
        }

        // --- Heading Image File Upload Logic ---
        if (headingImageFile instanceof File && headingImageFile.size > 0) {
            const buffer = Buffer.from(await headingImageFile.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${headingImageFile.name}`,
                folder: '/blog-heading-images',
            });

            if (uploadResponse.url) {
                updateData.headingImage = uploadResponse.url; // Corrected casing: HeadingImage
            } else {
                return NextResponse.json(
                    { success: false, message: 'Failed to upload new heading image file.' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else if (headingImageFile === 'null' || headingImageFile === '') {
            updateData.headingImage = ''; 
        }

        // Check if any update data is provided
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No valid fields provided for update.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedDoc = await Blog.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            return NextResponse.json(
                { success: false, message: 'Blog entry not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedDoc, message: 'Blog entry updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`PUT /api/blog/${id} error:`, error);
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
        const deletedDoc = await Blog.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Blog document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Blog content deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/blog/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}