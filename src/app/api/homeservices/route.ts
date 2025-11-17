import { NextRequest, NextResponse } from "next/server";
import HomeServicesModel from "@/models/HomeServices";
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

    const docs = await HomeServicesModel.find({});

    if (docs.length === 0) {
      return NextResponse.json(
        { success: true, data: [], message: 'No HomeServices documents found.' },
        { status: 200, headers: corsHeaders }
      );
    }


    return NextResponse.json(
      { success: true, data: docs },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET /api/homeservices error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}



// ✅ File upload helper
const uploadFile = async (file: File | null, folder = "/service_images") => {
  if (!file || file.size === 0) return undefined;

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadRes = await imagekit.upload({
    file: buffer,
    fileName: file.name,
    folder,
  });

  return uploadRes.url;
};

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    console.log("service data:", formData);

    // ✅ Basic fields
   
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const mainImage = await uploadFile(formData.get("mainImage") as File | null);
   
 
  
    // ✅ Validation
    if (!title || title.trim() === "" || !description || description.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Title and Description are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ Create new document
    const newService = await HomeServicesModel.create({
      title,
      mainImage,
      description,
    });

    return NextResponse.json(
      { success: true, data: newService, message: "Home service created successfully." },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST /api/homeservices error:", error);

    // ✅ Handle Mongoose ValidationError
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(
        (err) => (err as mongoose.Error.ValidatorError).message
      );
      return NextResponse.json(
        { success: false, message: "Validation failed: " + errors.join(", ") },
        { status: 400, headers: corsHeaders }
      );
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}