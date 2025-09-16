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



// ✅ Helper function: upload single image
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



// export async function POST(req: NextRequest) {
//     await connectToDatabase();

//     try {
//         const formData = await req.formData();
//         console.log("form data:", formData);

//         // ✅ Basic fields
//         const title = formData.get("title")?.toString() || "";
//         const subTitle = formData.get("subTitle")?.toString() || "";
//         const description = formData.get("description")?.toString() || "";
//         const category = formData.get("category")?.toString() || "";

//         // ✅ Arrays
//         const homeFeatureTags = formData.get("homeFeatureTags")
//             ? JSON.parse(formData.get("homeFeatureTags") as string)
//             : [];

//         const keyFeaturePoints = formData.get("keyFeaturePoints")
//             ? JSON.parse(formData.get("keyFeaturePoints") as string)
//             : [];

//         const technologyPoints = formData.get("technologyPoints")
//             ? JSON.parse(formData.get("technologyPoints") as string)
//             : [];

//         const futurePoints = formData.get("futurePoints")
//             ? JSON.parse(formData.get("futurePoints") as string)
//             : [];

//         // ✅ Project details (array of objects)
//         const projectDetailsRaw = formData.get("projectDetails")
//             ? JSON.parse(formData.get("projectDetails") as string)
//             : [];
//         // format should be: [{ title, description }...] from frontend
//         const projectDetails: { title: string; description: string; image: string }[] = [];

//         for (let i = 0; i < projectDetailsRaw.length; i++) {
//             const detail = projectDetailsRaw[i];

//             // ✅ FIX: use same key name as frontend
//             const imageFile = formData.get(`projectDetailsImages_${i}`) as File | null;

//             let imageUrl = "";
//             if (imageFile) {
//                 imageUrl = await uploadSingleImage(imageFile, "/products/projectDetails");
//             } else if (detail.image) {
//                 // for existing previews when editing
//                 imageUrl = detail.image;
//             }

//             projectDetails.push({
//                 title: detail.title,
//                 description: detail.description,
//                 image: imageUrl,
//             });
//         }


//         // ✅ Upload main/banners/others
//         const mainImageFile = formData.get("mainImage") as File | null;
//         const bannerImageFiles = formData.getAll("bannerImages") as File[];

//         const overviewImageFile = formData.get("overviewImage") as File | null;
//         const keyFeatureImageFile = formData.get("keyFeatureImage") as File | null;
//         const technologyImageFile = formData.get("technologyImage") as File | null;
//         const futureImageFile = formData.get("futureImage") as File | null;

//         const mainImageUrl = mainImageFile
//             ? await uploadSingleImage(mainImageFile, "/products/main")
//             : "";
//         const bannerImageUrls =
//             bannerImageFiles.length > 0
//                 ? await uploadMultipleImages(bannerImageFiles, "/products/banner")
//                 : [];

//         const overviewImageUrl = overviewImageFile
//             ? await uploadSingleImage(overviewImageFile, "/products/overview")
//             : "";
//         const keyFeatureImageUrl = keyFeatureImageFile
//             ? await uploadSingleImage(keyFeatureImageFile, "/products/keyFeatures")
//             : "";
//         const technologyImageUrl = technologyImageFile
//             ? await uploadSingleImage(technologyImageFile, "/products/technology")
//             : "";
//         const futureImageUrl = futureImageFile
//             ? await uploadSingleImage(futureImageFile, "/products/future")
//             : "";

//         // ✅ Other text fields
//         const overviewTitle = formData.get("overviewTitle")?.toString() || "";
//         const overviewDesc = formData.get("overviewDesc")?.toString() || "";

//         const keyFeatureTitle = formData.get("keyFeatureTitle")?.toString() || "";

//         const technologyTitle = formData.get("technologyTitle")?.toString() || "";
//         const technologyDesc = formData.get("technologyDesc")?.toString() || "";

//         // ✅ Save product
//         const newProduct = await Product.create({
//             title,
//             subTitle,
//             description,
//             category,
//             homeFeatureTags,

//             mainImage: mainImageUrl,
//             bannerImages: bannerImageUrls,

//             overviewTitle,
//             overviewImage: overviewImageUrl,
//             overviewDesc,

//             keyFeatureTitle,
//             keyFeatureImage: keyFeatureImageUrl,
//             keyFeaturePoints,

//             technologyTitle,
//             technologyImage: technologyImageUrl,
//             technologyPoints,
//             technologyDesc,

//             projectDetails, // ✅ array of objects

//             futurePoints,
//             futureImage: futureImageUrl,
//         });

//         return NextResponse.json(
//             { success: true, data: newProduct, message: "Product created successfully." },
//             { status: 201, headers: corsHeaders }
//         );
//     } catch (error) {
//         console.error("POST /api/product error:", error);
//         return NextResponse.json(
//             { success: false, message: "Internal Server Error" },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }




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

    const keyFeaturesRaw = formData.get("keyFeatures")
      ? JSON.parse(formData.get("keyFeatures") as string)
      : [];

    const projectDetailsRaw = formData.get("projectDetails")
      ? JSON.parse(formData.get("projectDetails") as string)
      : [];

    // ✅ Handle file uploads
    const mainImageFile = formData.get("mainImage") as File | null;
    const bannerImageFiles = formData.getAll("bannerImages") as File[];

    const overviewImageFile = formData.get("overviewImage") as File | null;
    const technologyImageFile = formData.get("technologyImage") as File | null;
    const futureImageFile = formData.get("futureImage") as File | null;

    const mainImageUrl = mainImageFile
      ? await uploadSingleImage(mainImageFile, "/products/main")
      : "";
    const bannerImageUrls =
      bannerImageFiles.length > 0
        ? await uploadMultipleImages(bannerImageFiles, "/products/banner")
        : [];

    const overviewImageUrl = overviewImageFile
      ? await uploadSingleImage(overviewImageFile, "/products/overview")
      : "";
    const technologyImageUrl = technologyImageFile
      ? await uploadSingleImage(technologyImageFile, "/products/technology")
      : "";
    const futureImageUrl = futureImageFile
      ? await uploadSingleImage(futureImageFile, "/products/future")
      : "";

    // ✅ Other text fields
    const overviewTitle = formData.get("overviewTitle")?.toString() || "";
    const overviewDesc = formData.get("overviewDesc")?.toString() || "";

    const technologyTitle = formData.get("technologyTitle")?.toString() || "";
    const technologyDesc = formData.get("technologyDesc")?.toString() || "";

    // ✅ Key features (with image upload per item)
    const keyFeatures: { title: string; description: string; image: string }[] =
      [];
    for (let i = 0; i < keyFeaturesRaw.length; i++) {
      const feature = keyFeaturesRaw[i];
      const imageFile = formData.get(`keyFeatureImage_${i}`) as File | null;

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadSingleImage(
          imageFile,
          "/products/keyFeatures"
        );
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
    const projectDetails: {
      title: string;
      description: string;
      image: string;
    }[] = [];
    for (let i = 0; i < projectDetailsRaw.length; i++) {
      const detail = projectDetailsRaw[i];
      const imageFile = formData.get(`projectDetailsImages_${i}`) as File | null;

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadSingleImage(
          imageFile,
          "/products/projectDetails"
        );
      } else if (detail.image) {
        imageUrl = detail.image;
      }

      projectDetails.push({
        title: detail.title,
        description: detail.description,
        image: imageUrl,
      });
    }

    // ✅ Save product
    const newProduct = await Product.create({
      title,
      subTitle,
      description,
      category,
      livedemoLink,
      homeFeatureTags,

      mainImage: mainImageUrl,
      bannerImages: bannerImageUrls,

      heading,
      measurableResults,
      projectTeam,

      overviewTitle,
      overviewImage: overviewImageUrl,
      overviewDesc,

      keyFeatures,
      technologyTitle,
      technologyImage: technologyImageUrl,
      technologyPoints,
      technologyDesc,

      projectDetails,
      futurePoints,
      futureImage: futureImageUrl,
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
