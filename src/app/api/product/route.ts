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

    // ✅ Arrays (string[])
    const homeFeatureTags = formData.get("homeFeatureTags")
      ? JSON.parse(formData.get("homeFeatureTags") as string)
      : [];

    const technologyPoints = formData.get("technologyPoints")
      ? JSON.parse(formData.get("technologyPoints") as string)
      : [];

    const futurePoints = formData.get("futurePoints")
      ? JSON.parse(formData.get("futurePoints") as string)
      : [];

    // ✅ Arrays of objects
    const heading = formData.get("heading")
      ? JSON.parse(formData.get("heading") as string)
      : [];

    const measurableResults = formData.get("measurableResults")
      ? JSON.parse(formData.get("measurableResults") as string)
      : [];

    const projectTeam = formData.get("projectTeam")
      ? JSON.parse(formData.get("projectTeam") as string)
      : [];

    const overview = formData.get("overview")
      ? JSON.parse(formData.get("overview") as string)
      : [];

    const developmentTimeline = formData.get("developmentTimeline")
      ? JSON.parse(formData.get("developmentTimeline") as string)
      : [];

    const keyFeaturesRaw = formData.get("keyFeatures")
      ? JSON.parse(formData.get("keyFeatures") as string)
      : [];

    const projectDetailsRaw = formData.get("projectDetails")
      ? JSON.parse(formData.get("projectDetails") as string)
      : [];

    // ✅ Handle file uploads
    const mainImageFile = formData.get("mainImage") as File | null;
    const bannerImageFile = formData.get("bannerImage") as File | null;
    const galleryImageFiles = formData.getAll("galleryImages") as File[];
    const overviewImageFile = formData.get("overviewImage") as File | null;
    const technologyImageFile = formData.get("technologyImage") as File | null;

    // Upload images
    const mainImageUrl = mainImageFile
      ? await uploadSingleImage(mainImageFile, "/products/main")
      : "";

    const bannerImageUrl = bannerImageFile
      ? await uploadSingleImage(bannerImageFile, "/products/banner")
      : "";

    const galleryImageUrls = galleryImageFiles.length > 0
      ? await uploadMultipleImages(galleryImageFiles, "/products/gallery")
      : [];

    const overviewImageUrl = overviewImageFile
      ? await uploadSingleImage(overviewImageFile, "/products/overview")
      : "";

    const technologyImageUrl = technologyImageFile
      ? await uploadSingleImage(technologyImageFile, "/products/technology")
      : "";

    // ✅ Other text fields
    const technologyTitle = formData.get("technologyTitle")?.toString() || "";
    const technologyDesc = formData.get("technologyDesc")?.toString() || "";

    // ✅ Key features (with image upload per item)
    const keyFeatures: { title: string; description: string; image: string }[] = [];
    for (let i = 0; i < keyFeaturesRaw.length; i++) {
      const feature = keyFeaturesRaw[i];
      const imageFile = formData.get(`keyFeatureImage_${i}`) as File | null;

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadSingleImage(imageFile, "/products/keyFeatures");
      } else if (feature.image) {
        imageUrl = feature.image;
      }

      keyFeatures.push({
        title: feature.title,
        description: feature.description,
        image: imageUrl,
      });
    }

    // ✅ Project details (with image upload per item)
    const projectDetails: { title: string; description: string; image: string }[] = [];
    for (let i = 0; i < projectDetailsRaw.length; i++) {
      const detail = projectDetailsRaw[i];
      const imageFile = formData.get(`projectDetailsImage_${i}`) as File | null;

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadSingleImage(imageFile, "/products/projectDetails");
      } else if (detail.image) {
        imageUrl = detail.image;
      }

      projectDetails.push({
        title: detail.title,
        description: detail.description,
        image: imageUrl,
      });
    }

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
      heading,
      measurableResults,
      projectTeam,
      developmentTimeline,
      overview,
      overviewImage: overviewImageUrl,
      keyFeatures,
      technologyTitle,
      technologyImage: technologyImageUrl,
      technologyPoints,
      technologyDesc,
      projectDetails,
      futurePoints
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

