// src/app/api/counter/[id]/route.js
import {  NextResponse } from "next/server";
import Counter from "@/models/CounterModal";
import { connectToDatabase } from "@/utils/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS", // Note: No POST here
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ICounter {
  title?: string;
  count?: number;
  description?: string;
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// GET a specific counter by ID
export async function GET(req: Request) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const doc = await Counter.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Counter not found.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/counter/${id} error:`, error);
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
  try {
    const body = await req.json();

    // Create an object with only the fields that are present and valid
    const updateData: ICounter = {}; // Use the new interface for type-safety
    if (body.title !== undefined && typeof body.title === 'string') {
      updateData.title = body.title;
    }
    if (body.count !== undefined && typeof body.count === 'number') {
      updateData.count = body.count;
    }
    if (body.description !== undefined && typeof body.description === 'string') {
      updateData.description = body.description;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields provided for update.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedDoc = await Counter.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDoc) {
      return NextResponse.json(
        { success: false, message: 'Counter not found for update.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: updatedDoc, message: 'Counter updated successfully.' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`PUT /api/counter/${id} error:`, error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE a specific counter by ID
export async function DELETE(req: Request) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const deletedDoc = await Counter.findByIdAndDelete(id);

    if (!deletedDoc) {
      return NextResponse.json(
        { success: false, message: 'Counter not found for deletion.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: deletedDoc, message: 'Counter deleted successfully.' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`DELETE /api/counter/${id} error:`, error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}