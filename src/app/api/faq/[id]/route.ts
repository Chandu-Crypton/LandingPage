import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Faq, {IFaq} from "@/models/Faq";
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
    const doc = await Faq.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Faq not found.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/Faq/${id} error:`, error);
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
      { success: false, message: "Invalid or missing Faq ID." },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const formData = await req.formData();
    const updateData: Partial<IFaq> = {};

    // --- Basic string fields ---
    const modules = formData.get("module")?.toString();
    if (modules) updateData.module = modules;

    // --- Questions array update ---
    const questionsString = formData.get("question")?.toString();
    if (questionsString) {
      try {
        const parsedQuestions = JSON.parse(questionsString);

        if (Array.isArray(parsedQuestions)) {
          // fetch existing faq first
          const existingFaq = await Faq.findById(id);
          if (!existingFaq) {
            return NextResponse.json(
              { success: false, message: "Faq not found." },
              { status: 404, headers: corsHeaders }
            );
          }

          updateData.question = await Promise.all(
            parsedQuestions.map(
              async (

                q: { question: string; answer: string; icon?: string },
                idx: number
              ) => {
                let iconUrl = q.icon || existingFaq.question[idx]?.icon || "";

                const iconFile = formData.get(`questionIcon_${idx}`);
                if (iconFile instanceof File && iconFile.size > 0) {
                  const buffer = Buffer.from(await iconFile.arrayBuffer());
                  const uploadRes = await imagekit.upload({
                    file: buffer,
                    fileName: `${uuidv4()}-${iconFile.name}`,
                    folder: "/faq/questionIcon",
                  });
                  iconUrl = uploadRes.url;
                }

                return {
                  question: q.question ?? existingFaq.question[idx]?.question,
                  answer: q.answer ?? existingFaq.question[idx]?.answer,
                  icon: iconUrl,
                };
              }
            )
          );
        } else {
          return NextResponse.json(
            { success: false, message: "Question must be a JSON array." },
            { status: 400, headers: corsHeaders }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid JSON format for question field." },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // --- Validate ---
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided for update." },
        { status: 400, headers: corsHeaders }
      );
    }

    // --- Update ---
    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedFaq) {
      return NextResponse.json(
        { success: false, message: "Faq entry not found for update." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedFaq, message: "Faq updated successfully." },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`PUT /api/faq/${id} error:`, error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
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
        const deletedDoc = await Faq.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Faq document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Faq content deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/faq/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}