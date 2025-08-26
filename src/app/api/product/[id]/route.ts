

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db'; 
import Product, { IProduct } from '@/models/Product';
import imagekit from '@/utils/imagekit'; 
import { v4 as uuidv4 } from 'uuid'; 
import mongoose from 'mongoose'; 
import { processArrayField } from '../route';

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

    // 1. Process string fields
    const stringFields: Array<keyof IProduct> = [
      'heading', 'title', 'subHeading', 'description',
      'franchiseData', 'efficiency', 'rating', 'category',
      'googleStoreLink', 'appleStoreLink', 'deployLink', 'emailLink', 'contact'
    ];

    const updateData: Partial<IProduct> = {};
    stringFields.forEach(field => {
      const value = formData.get(field);
      if (typeof value === 'string' && value.trim()) updateData[field] = value.trim();
      else if (value === '') updateData[field] = '';
    });

    // 2. Handle videoFile (URL or actual file)
    const videoFile = formData.get('videoFile');
    if (videoFile) {
      if (typeof videoFile === 'string' && videoFile.trim()) {
        updateData.videoFile = videoFile.trim();
      } else if (videoFile instanceof File && videoFile.size > 0) {
        const buffer = Buffer.from(await videoFile.arrayBuffer());
        const uploadResponse = await imagekit.upload({
          file: buffer,
          fileName: `${uuidv4()}-${videoFile.name}`,
          folder: '/product-videos',
        });
        if (uploadResponse.url) updateData.videoFile = uploadResponse.url;
      } else if (videoFile === '') {
        updateData.videoFile = '';
      }
    }

    // 3. Process array fields using helper
    const parsedProductControls = await processArrayField<IProduct['productControls'][0]>(
      formData,
      'productControls',
      'productIcon',
      'productIconUrl_existing',
      '/product-icons',
      ['productTitle', 'productDescription']
    );

    const parsedKeyFeatures = await processArrayField<IProduct['keyFeatures'][0]>(
      formData,
      'keyFeatures',
      'featureIcon',
      'featureIconUrl_existing',
      '/feature-icons',
      ['featureTitle', 'featureDescription']
    );

    const parsedScreenshot = await processArrayField<IProduct['screenshot'][0]>(
      formData,
      'screenshot',
      'file',
      'imageUrl_existing',
      '/product-screenshots',
      []
    );

    // 4. Assign to updateData
    if (parsedProductControls.length > 0) updateData.productControls = parsedProductControls;
    if (parsedKeyFeatures.length > 0) updateData.keyFeatures = parsedKeyFeatures;
    if (parsedScreenshot.length > 0) updateData.screenshot = parsedScreenshot;

    // 5. Update in DB
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
