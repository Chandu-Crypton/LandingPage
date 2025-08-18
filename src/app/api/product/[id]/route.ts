

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db'; 
import Product, { IProduct } from '@/models/Product';
import imagekit from '@/utils/imagekit'; 
import { v4 as uuidv4 } from 'uuid'; 
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
            { success: false, message: 'Invalid or missing Product ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
       
        const product = await Product.findById(id).lean();

        if (!product) { 
            return NextResponse.json(
                { success: false, message: 'Product not found or has been deleted.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: product as IProduct, message: 'Product fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/product/[id] error:', error);
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
            { success: false, message: 'Invalid or missing Product ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        const formData = await req.formData();

        const updateData: Partial<IProduct> & { [key: string]: string | string[] | Array<Record<string, string>> } = {};
        // 1. Process string fields
        const stringFields = [
            'heading', 'title', 'subHeading', 'description', 'franchiseData', 'efficiency', 'rating'
        ];
        stringFields.forEach(field => {
            const value = formData.get(field);
            if (typeof value === 'string' && value.trim()) {
                updateData[field] = value.trim();
            } else if (value === '') { 
                updateData[field] = '';
            }
        });

        // 2. Handle videoFile (URL or File Upload)
        const videoFile = formData.get('videoFile');
        if (videoFile) { 
            if (typeof videoFile === 'string' && videoFile.trim()) {
                updateData.videoFile = videoFile.trim(); 
            } else if (videoFile instanceof File) {
                if (videoFile.size > 0) {
                    const buffer = Buffer.from(await videoFile.arrayBuffer());
                    const uploadResponse = await imagekit.upload({
                        file: buffer,
                        fileName: `${uuidv4()}-${videoFile.name}`,
                        folder: '/product-videos',
                    });
                    if (uploadResponse.url) {
                        updateData.videoFile = uploadResponse.url;
                    } else {
                        return NextResponse.json(
                            { success: false, message: 'Failed to upload new video file to ImageKit.' },
                            { status: 500, headers: corsHeaders }
                        );
                    }
                } else {
                 
                    updateData.videoFile = '';
            
                }
            } else if (videoFile === '') { 
                 updateData.videoFile = '';
             
            }
        }
      
        // 3. Process JSON stringified array fields
        const jsonArrayFields = [
            'productControls', 'keyFeatures', 'screenshot'
        ];
        for (const field of jsonArrayFields) {
            const jsonString = formData.get(field);
            if (jsonString && typeof jsonString === 'string') {
                try {
                    const parsedArray = JSON.parse(jsonString);
                    if (Array.isArray(parsedArray)) {
                        
                        if (field === 'productControls' && !parsedArray.every(item => typeof item === 'object' && item !== null && 'productTitle' in item && 'productIcon' in item && 'productDescription' in item)) {
                            throw new Error('Invalid elements in productControls array.');
                        }
                        if (field === 'keyFeatures' && !parsedArray.every(item => typeof item === 'object' && item !== null && 'featureTitle' in item && 'featureIcon' in item && 'featureDescription' in item)) {
                            throw new Error('Invalid elements in keyFeatures array.');
                        }
                        if (field === 'screenshot' && !parsedArray.every(item => typeof item === 'object' && item !== null && 'screenshotImage' in item)) {
                            throw new Error('Invalid elements in screenshot array.');
                        }
                        updateData[field] = parsedArray;
                    } else {
                        throw new Error(`Expected array for ${field}, but received non-array.`);
                    }
                } catch (jsonError) {
                    console.error(`PUT /api/product/[id] error parsing ${field}:`, jsonError);
                    return NextResponse.json(
                        { success: false, message: `Invalid JSON format or structure for ${field}: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}` },
                        { status: 400, headers: corsHeaders }
                    );
                }
            } else if (jsonString === '') { 
                updateData[field] = [];
            }
        }

      
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true } 
        ).lean(); 

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, message: 'Product not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedProduct as IProduct, message: 'Product updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/product/[id] error:', error);
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
            { success: false, message: 'Invalid or missing Product ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        // Perform a soft delete by setting 'isDeleted' to true
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json(
                { success: false, message: 'Product not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

      
        

        return NextResponse.json(
            { success: true, message: 'Product successfully marked as deleted.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('DELETE /api/product/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
