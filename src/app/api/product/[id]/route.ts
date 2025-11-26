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




// ✅ Helper: upload one image
async function uploadSingleImage(file: File, folder: string): Promise<string> {
  if (!file || file.size === 0) return "";
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadRes = await imagekit.upload({
    file: buffer,
    fileName: `${uuidv4()}-${file.name}`,
    folder,
  });
  return uploadRes.url;
}

// ✅ Helper: upload multiple images
async function uploadMultipleImages(files: File[], folder: string): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadSingleImage(file, folder);
    if (url) urls.push(url);
  }
  return urls;
}




export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing Product ID." },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const formData = await req.formData();
    console.log("form data:", formData);

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const updateData: Partial<IProduct> = {};

    // ✅ Simple text fields
    [
      "title",
      "subTitle",
      "description",
      "category",
      "livedemoLink",
      "googleStoreLink",
      "appleStoreLink"
    ].forEach((field) => {
      if (formData.has(field)) {
        updateData[field as keyof IProduct] = formData.get(field)?.toString();
      }
    });

    // ✅ Arrays of strings
    const arrayFields = ["homeFeatureTags"];
    arrayFields.forEach((field) => {
      if (formData.has(field)) {
        try {
          updateData[field as keyof IProduct] = JSON.parse(
            formData.get(field) as string
          );
        } catch {
          updateData[field as keyof IProduct] = [];
        }
      }
    });

  


    // ✅ Single Images
    const imageFields = [
      { name: "bannerImage", folder: "/products/banner" },
    ];

    for (const { name, folder } of imageFields) {
      if (formData.has(name)) {
        const file = formData.get(name) as File | null;
        const existingValue = formData.get(`${name}_existing`) as string | null;
        
        if (file && file.size > 0) {
          // New file uploaded
          updateData[name as keyof IProduct] = await uploadSingleImage(
            file,
            folder
          );
        } else if (existingValue) {
          // Keep existing image
          updateData[name as keyof IProduct] = existingValue;
        }
      }
    }

    // ✅ Gallery Images
    const galleryFiles = formData.getAll("galleryImages") as File[];
    if (galleryFiles.length > 0) {
      const urls = await uploadMultipleImages(galleryFiles, "/products/gallery");
      updateData.galleryImages = urls;
    } else if (formData.has("galleryImages_existing")) {
      // Keep existing gallery images if no new files uploaded
      try {
        const existingGallery = JSON.parse(formData.get("galleryImages_existing") as string);
        updateData.galleryImages = existingGallery;
      } catch {
        updateData.galleryImages = [];
      }
    }


     const mainImageFiles = formData.getAll("mainImage") as File[];
    if (mainImageFiles.length > 0) {
      const urls = await uploadMultipleImages(mainImageFiles, "/products/main");
      updateData.mainImage = urls;
    } else if (formData.has("mainImage_existing")) {
      // Keep existing main images if no new files uploaded
      try {
        const existingMainImages = JSON.parse(formData.get("mainImage_existing") as string);
        updateData.mainImage = existingMainImages;
      } catch {
        updateData.mainImage = [];
      }
    }
    // ✅ Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, data: updatedProduct, message: "Product updated successfully." },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("PUT /api/product/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
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
