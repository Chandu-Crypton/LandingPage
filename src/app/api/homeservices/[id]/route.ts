import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import HomeServicesModel, {IHomeServices} from "@/models/HomeServices";
import imagekit from "@/utils/imagekit";
// import { v4 as uuidv4 } from 'uuid';
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
    const doc = await HomeServicesModel.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Home service not found.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/homeservices/${id} error:`, error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}


const uploadIfExists = async (file: File | null, oldValue?: string) => {
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadRes = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/service_images",
    });
    return uploadRes.url;
  }
  return oldValue;
};




export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing Service ID." },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const formData = await req.formData();
    const existingService = await HomeServicesModel.findById(id);

    if (!existingService) {
      return NextResponse.json(
        { success: false, message: "Service not found." },
        { status: 404, headers: corsHeaders }
      );
    }

    // ✅ Basic fields
    const title = formData.get("title")?.toString() || existingService.title || "";
    const description = formData.get("description")?.toString() || existingService.description || "";
    const mainImage = await uploadIfExists(
      formData.get("mainImage") as File | null,
      existingService.mainImage
    );



    // ✅ Update the document - FIXED field names to match schema
    const updatedService = await HomeServicesModel.findByIdAndUpdate<IHomeServices>(
      id,
      {
        title,     
        mainImage,     
        description,
     
      },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { success: false, message: "Failed to update service." },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: "Home Services updated successfully." }, // ✅ Fixed: should be success: true
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("PUT /api/homeservices/:id error:", error);
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
        const deletedDoc = await HomeServicesModel.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Home service document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Service content deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/service/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}