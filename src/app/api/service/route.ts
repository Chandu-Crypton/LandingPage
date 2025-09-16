import { NextRequest, NextResponse } from "next/server";
import ServiceModel from "@/models/Service";
import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";
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

        const docs = await ServiceModel.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Service documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }


        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/service error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}



export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData = await req.formData();

    // Helpers
    const uploadIfExists = async (file: File | null) => {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadRes = await imagekit.upload({
          file: buffer,
          fileName: file.name,
          folder: "/service_images",
        });
        return uploadRes.url;
      }
      return undefined;
    };

    // Text fields
    const title = formData.get("title")?.toString();
    const descriptionString = formData.get("description")?.toString();
    const description: string[] = descriptionString ? JSON.parse(descriptionString) : [];

    // File fields
    const mainImageFile = formData.get("mainImage") as File | null;
    const bannerImageFile = formData.get("bannerImage") as File | null;
    const serviceImage1File = formData.get("serviceImage1") as File | null;
    const serviceImage2File = formData.get("serviceImage2") as File | null;

    const mainImage = await uploadIfExists(mainImageFile);
    const bannerImage = await uploadIfExists(bannerImageFile);
    const serviceImage1 = await uploadIfExists(serviceImage1File);
    const serviceImage2 = await uploadIfExists(serviceImage2File);

    // Arrays & objects
    const serviceArrayString = formData.get("service")?.toString();
    const serviceArray = serviceArrayString ? JSON.parse(serviceArrayString) : [];

    const technologyString = formData.get("technology")?.toString();
    const technology = technologyString ? JSON.parse(technologyString) : null;

    const whyChooseUsString = formData.get("whyChooseUs")?.toString();
    const whyChooseUs = whyChooseUsString ? JSON.parse(whyChooseUsString) : [];

    // Validation
    if (
      !title ||
      description.length === 0 ||
      !mainImage ||
      !serviceImage1 ||
      !serviceImage2 ||
      !technology
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Save
    const newService = await ServiceModel.create({
      title,
      description,
      mainImage,
      bannerImage,
      serviceImage1,
      serviceImage2,
      service: serviceArray,
      technology,
      whyChooseUs,
    });

    return NextResponse.json(
      { success: true, data: newService, message: "Service created successfully." },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST /api/service error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";

    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(
        (err) => (err as mongoose.Error.ValidatorError).message
      );
      return NextResponse.json(
        { success: false, message: "Validation failed: " + errors.join(", ") },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}