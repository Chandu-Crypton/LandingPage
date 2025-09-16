import { NextRequest, NextResponse } from "next/server";
import Testimonial from "@/models/Testimonial";
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose"; 
import imagekit from "@/utils/imagekit";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};



export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const doc = await Testimonial.findById(id);
        if (doc.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Testimonial documents found.' }, 
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: doc },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/testimonial error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}





export async function PUT(req: Request) {
  await connectToDatabase();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  // Validate ID format
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing ID." },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const formData = await req.formData();

    const updateData: Partial<{
      sectionTitle: string;
      mainImage: string;
      title: string;
      fullName: string;
      description: string;
      rating: number;
    }> = {};

    const sectionTitle = formData.get("sectionTitle")?.toString();
    const title = formData.get("title")?.toString();
    const fullName = formData.get("fullName")?.toString();
    const description = formData.get("description")?.toString();
    const rating = formData.get("rating")?.toString();
    const mainImageFile = formData.get("mainImage") as File | null;

    if (sectionTitle) updateData.sectionTitle = sectionTitle;
    if (title) updateData.title = title;
    if (fullName) updateData.fullName = fullName;
    if (description) updateData.description = description;
    if (rating && !isNaN(Number(rating))) {
      updateData.rating = Number(rating);
    }

    // Handle image upload if new file is provided
    if (mainImageFile && mainImageFile.size > 0) {
      const buffer = Buffer.from(await mainImageFile.arrayBuffer());
      const uploadRes = await imagekit.upload({
        file: buffer,
        fileName: mainImageFile.name,
        folder: "/testimonial_images",
      });
      updateData.mainImage = uploadRes.url;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided for update." },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedDoc = await Testimonial.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found for update." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedDoc,
        message: "Testimonial updated successfully.",
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`PUT /api/testimonial/${id} error:`, error);
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
        const deletedDoc = await Testimonial.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Testimonial document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Testimonial content deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/testimonial/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}