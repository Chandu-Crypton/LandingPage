import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import NormalInternship, { INormalInternship } from "@/models/NormalInternship";
import imagekit from "@/utils/imagekit";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// GET by ID
export async function GET(req: Request) {
  await connectToDatabase();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ID." },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const doc = await NormalInternship.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: "Internship not found." },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/normalInternship/${id} error:`, error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500, headers: corsHeaders });
  }
}

// PUT / Update
export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing Internship ID." },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const updateData: Partial<INormalInternship> = {};

    // --- Text Fields ---
    const textFields = [
      "title",
      "subtitle",
      "description",
      "duration",
      "durationDetails",
      "mode",
      "category",
      "stipend",
      "schedule",
    ];
    textFields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null && value !== undefined) {
        const stringValue = value.toString();
        updateData[field as keyof INormalInternship] = stringValue || undefined;
      }
    });

    // --- Simple Arrays ---
    const arrayFields = ["tags", "benefits", "eligibility", "workEnvironment"];
    for (const field of arrayFields) {
      const value = formData.get(field);
      if (value !== null && value !== undefined) {
        try {
          const parsed = JSON.parse(value.toString());
          if (Array.isArray(parsed)) updateData[field as keyof INormalInternship] = parsed;
        } catch (error) {
            console.log("error :", error)
          return NextResponse.json(
            
            { success: false, message: `Invalid JSON format for ${field}` },
            { status: 400 }
          );
        }
      }
    }

    // --- Responsibilities ---
    const responsibilitiesValue = formData.get("responsibilities");
    if (responsibilitiesValue) {
      try {
        const parsed = JSON.parse(responsibilitiesValue.toString());
        if (parsed.musthave && parsed.nicetohave) {
          updateData.responsibilities = {
            musthave: parsed.musthave,
            nicetohave: parsed.nicetohave,
          };
        }
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid JSON for responsibilities" },
          { status: 400 }
        );
      }
    }

    // --- Nested Arrays with Icons ---
    const handleNestedArrayWithIcons = async (
      fieldName: "skills" | "tool" | "summary",
      iconFieldBase: string,
      folder: string
    ) => {
      const value = formData.get(fieldName);
      if (!value) return;

      let parsedArray;
      try {
        parsedArray = JSON.parse(value.toString());
        if (!Array.isArray(parsedArray)) throw new Error(`${fieldName} should be an array`);
      } catch {
        return NextResponse.json(
          { success: false, message: `Invalid JSON for ${fieldName}` },
          { status: 400 }
        );
      }

      const existingInternship = await NormalInternship.findById(id);
      if (!existingInternship) throw new Error("Internship not found");

      const existingArray = existingInternship[fieldName] || [];
      const finalArray = [];

      for (let i = 0; i < parsedArray.length; i++) {
        const item = parsedArray[i];
        const existingItem = existingArray[i] || {};
        const file = formData.get(`${iconFieldBase}_${i}`) as File | null;
        let iconUrl = "";

        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const uploadRes = await imagekit.upload({
            file: buffer,
            fileName: `${uuidv4()}-${file.name}`,
            folder,
          });
          iconUrl = uploadRes.url;
        } else {
          // Preserve existing icon if no new file is provided
          if (fieldName === "skills") iconUrl = existingItem.skillIcon || "";
          if (fieldName === "tool") iconUrl = existingItem.toolIcon || "";
          if (fieldName === "summary") iconUrl = existingItem.icon || "";
        }

        if (fieldName === "skills") item.skillIcon = iconUrl;
        if (fieldName === "tool") item.toolIcon = iconUrl;
        if (fieldName === "summary") item.icon = iconUrl;

        finalArray.push(item);
      }

      updateData[fieldName as keyof INormalInternship] = finalArray;
    };

    await handleNestedArrayWithIcons("skills", "skillIcon", "/internship-skills");
    await handleNestedArrayWithIcons("tool", "toolIcon", "/internship-tools");
    await handleNestedArrayWithIcons("summary", "summaryIcon", "/internship-summary");

    // --- Images ---
    const handleImage = async (fieldName: string, folder: string) => {
      const file = formData.get(fieldName);
      if (file instanceof File && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadRes = await imagekit.upload({
          file: buffer,
          fileName: `${uuidv4()}-${file.name}`,
          folder,
        });
        updateData[fieldName as keyof INormalInternship] = uploadRes.url;
      } else if (file === "null") {
        updateData[fieldName as keyof INormalInternship] = "";
      }
    };
    await handleImage("mainImage", "/internship-main-images");
    await handleImage("bannerImage", "/internship-banner-images");

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided for update." },
        { status: 400 }
      );
    }

    const updatedInternship = await NormalInternship.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    if (!updatedInternship) {
      return NextResponse.json(
        { success: false, message: "Internship not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedInternship, message: "Internship updated successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error(`PUT /api/normalInternship/${id} error:`, error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// DELETE by ID
export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing ID." },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const deletedDoc = await NormalInternship.findByIdAndDelete(id);
    if (!deletedDoc) {
      return NextResponse.json(
        { success: false, message: "Internship not found for deletion." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: "Internship deleted successfully." },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`DELETE /api/internship/${id} error:`, error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500, headers: corsHeaders });
  }
}
