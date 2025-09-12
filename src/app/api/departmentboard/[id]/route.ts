import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import DepartmentBoard, {IDepartmentBoard} from "@/models/DepartmentBoard";
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
    const doc = await DepartmentBoard.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Board not found.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/departmentboard/${id} error:`, error);
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
        const updateData: Partial<IDepartmentBoard> = {}; // Partial<IBoard>

        // --- Text Fields ---
        const fullName = formData.get("fullName")?.toString();
        const role = formData.get("role")?.toString();
        const socialLink = formData.get("socialLink")?.toString();
        const description = formData.get("description")?.toString();

        if (fullName) updateData.fullName = fullName;
        if (role) updateData.role = role;
        if (socialLink) updateData.socialLink = socialLink;
        if (description) updateData.description = description;

        // --- Main Image ---
        const mainImageFile = formData.get("mainImage");
        if (mainImageFile instanceof File && mainImageFile.size > 0) {
            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${mainImageFile.name}`,
                folder: "/board-main-images",
            });
            updateData.mainImage = uploadRes.url;
        } else if (mainImageFile === "null" || mainImageFile === "") {
            updateData.mainImage = "";
        }

      

        // --- Check if anything to update ---
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: "No valid fields provided for update." },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedInternship = await DepartmentBoard.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedInternship) {
            return NextResponse.json(
                { success: false, message: "Board entry not found for update." },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedInternship, message: "Board entry updated successfully." },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`PUT /api/board/${id} error:`, error);
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
        const deletedDoc = await DepartmentBoard.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'DepartmentBoard document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'DepartmentBoard content deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/departmentboard/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}