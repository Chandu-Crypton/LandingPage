import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Product from '@/models/Product';
import imagekit from '@/utils/imagekit'; // Ensure ImageKit utility is imported
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for uploads

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};


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

// ✅ Helper function: upload multiple images
async function uploadMultipleImages(files: File[], folder: string): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
        const url = await uploadSingleImage(file, folder);
        if (url) urls.push(url);
    }
    return urls;
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData = await req.formData();

    // ✅ Basic fields
    const title = formData.get("title")?.toString() || "";
    const subTitle = formData.get("subTitle")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const livedemoLink = formData.get("livedemoLink")?.toString() || "";
    const googleStoreLink = formData.get("googleStoreLink")?.toString() || "";
    const appleStoreLink = formData.get("appleStoreLink")?.toString() || "";

    // ✅ Arrays (string[])
    const homeFeatureTags = formData.get("homeFeatureTags")
      ? JSON.parse(formData.get("homeFeatureTags") as string)
      : [];

    
  
    // ✅ Handle file uploads
    const mainImageFiles = formData.getAll("mainImage") as File[];
    const bannerImageFile = formData.get("bannerImage") as File | null;
    const galleryImageFiles = formData.getAll("galleryImages") as File[];
    

    // Upload images
    const mainImageUrl = mainImageFiles.length > 0
      ? await uploadMultipleImages(mainImageFiles, "/products/main")
      : "";

    const bannerImageUrl = bannerImageFile
      ? await uploadSingleImage(bannerImageFile, "/products/banner")
      : "";

    const galleryImageUrls = galleryImageFiles.length > 0
      ? await uploadMultipleImages(galleryImageFiles, "/products/gallery")
      : [];




    // ✅ Validation for required fields
    if (!title || !subTitle || !description || !category || !mainImageUrl || !bannerImageUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ Save product with exact schema structure
    const newProduct = await Product.create({
      title,
      subTitle,
      description,
      category,
      homeFeatureTags,
      mainImage: mainImageUrl,
      bannerImage: bannerImageUrl,
      galleryImages: galleryImageUrls,
      livedemoLink,
      googleStoreLink,
      appleStoreLink,
    });

    return NextResponse.json(
      { success: true, data: newProduct, message: "Product created successfully." },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST /api/product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}


export async function GET() {
    await connectToDatabase();

    try {
        const products = await Product.find({ isDeleted: { $ne: true } }).lean();

        return NextResponse.json(
            { success: true, data: products, message: 'Products fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/product error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}

