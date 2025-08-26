import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Internship, {IInternship} from "@/models/Internship";
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
    const doc = await Internship.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Internship not found.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/internship/${id} error:`, error);
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
        const updateData: Partial<IInternship> = {}; // Partial<IInternship>

        // --- Text Fields ---
        const title = formData.get("title")?.toString();
        const subtitle = formData.get("subtitle")?.toString();
        const fee = formData.get("fee")?.toString();
        const description = formData.get("description")?.toString();
        const mode = formData.get("mode")?.toString();
        const duration = formData.get("duration")?.toString();

        if (title) updateData.title = title;
        if (subtitle) updateData.subtitle = subtitle;
        if (fee) updateData.fee = fee;
        if (description) updateData.description = description;
        if (mode) updateData.mode = mode;
        if (duration) updateData.duration = duration;

        // --- Benefits ---
        const benefitsString = formData.get("benefits")?.toString();
        if (benefitsString) {
            try {
                const parsedBenefits = JSON.parse(benefitsString);
                if (Array.isArray(parsedBenefits)) {
                    updateData.benefits = parsedBenefits.map((b: string) => b.trim()).filter(Boolean);
                } else {
                    return NextResponse.json(
                        { success: false, message: "Benefits should be a JSON array of strings." },
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

        // --- Eligibility ---
        const eligibilityString = formData.get("eligibility")?.toString();

        if (eligibilityString) {
            try {
                const parsedEligibility = JSON.parse(eligibilityString);
                if (Array.isArray(parsedEligibility)) {
                    updateData.eligibility = parsedEligibility.map((e: string) => e.trim()).filter(Boolean);
                } else {
                    return NextResponse.json(
                        { success: false, message: "Eligibility should be a JSON array of strings." },
                        { status: 400, headers: corsHeaders }
                    );
                }
            } catch {
                return NextResponse.json(
                    { success: false, message: "Invalid JSON format for eligibility." },
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
                folder: "/internship-main-images",
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

        const updatedInternship = await Internship.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedInternship) {
            return NextResponse.json(
                { success: false, message: "Internship entry not found for update." },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedInternship, message: "Internship entry updated successfully." },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`PUT /api/internship/${id} error:`, error);
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
        const deletedDoc = await Internship.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Internship document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Internship content deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/internship/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}