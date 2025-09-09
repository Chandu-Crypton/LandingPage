import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import ServiceModel, { IService } from "@/models/Service";
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
    const doc = await ServiceModel.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Service not found.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/service/${id} error:`, error);
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
            { success: false, message: "Invalid or missing Blog ID." },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        const formData = await req.formData();
        const updateData: Partial<IService> = {}; // Partial<IService>

       
        const title = formData.get("title")?.toString();

        if (title) updateData.title = title;

       // --- Description ---
       const descriptionString = formData.get("description")?.toString();
        if (descriptionString) {
            try {
                const parsedDescription = JSON.parse(descriptionString);
                if (Array.isArray(parsedDescription)) {
                    updateData.description = parsedDescription.map((d: string) => d.trim()).filter(Boolean);
                } else {
                    return NextResponse.json(
                        { success: false, message: "Description should be a JSON array of strings." },
                        { status: 400, headers: corsHeaders }
                    );
                }
            } catch {
                return NextResponse.json(
                    { success: false, message: "Invalid JSON format for tags." },
                    { status: 400, headers: corsHeaders }
                );
            }
        }


        // --- Main Image ---
        const mainImageFile = formData.get("mainImage");
        if (mainImageFile instanceof File && mainImageFile.size > 0) {
            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${mainImageFile.name}`,
                folder: "/service-main-images",
            });
            updateData.mainImage = uploadRes.url;
        } else if (mainImageFile === "null" || mainImageFile === "") {
            updateData.mainImage = "";
        }
       
        // --- Banner Image ---
        const bannerImageFile = formData.get("bannerImage");
        if (bannerImageFile instanceof File && bannerImageFile.size > 0) {
            const buffer = Buffer.from(await bannerImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${bannerImageFile.name}`,
                folder: "/service-banner-images",
            });
            updateData.bannerImage = uploadRes.url;
        } else if (bannerImageFile === "null" || bannerImageFile === "") {
            updateData.bannerImage = "";
        }
        

        // --- Check if anything to update ---
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: "No valid fields provided for update." },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedService = await ServiceModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedService) {
            return NextResponse.json(
                { success: false, message: "Service entry not found for update." },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedService, message: "Service entry updated successfully." },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`PUT /api/service/${id} error:`, error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
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
        const deletedDoc = await ServiceModel.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Service document not found for deletion.' },
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