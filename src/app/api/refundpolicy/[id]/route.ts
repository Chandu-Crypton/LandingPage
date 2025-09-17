import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import RefundPolicy from "@/models/Refund";
import { connectToDatabase } from "@/utils/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Refund Policy ID." },
        { status: 400, headers: corsHeaders }
      );
    }

    const body = await req.json().catch(() => null);
    const content = typeof body?.content === "string" ? body.content.trim() : "";

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Refund Policy content is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    const updated = await RefundPolicy.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Refund Policy not found." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: updated },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error updating Refund Policy.";
    console.error("PUT RefundPolicy Error:", error);
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: Request) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Privacy Policy ID." },
        { status: 400, headers: corsHeaders }
      );
    }

    const deleted = await RefundPolicy.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Refund Policy not found." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Refund Policy deleted successfully.",
        data: { id },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error deleting Refund Policy.";
    console.error("DELETE RefundPolicy Error:", error);
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}
