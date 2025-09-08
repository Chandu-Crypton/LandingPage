import { NextRequest, NextResponse } from "next/server";
import Package from "@/models/Packages";
import { connectToDatabase } from "@/utils/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// GET all packages
export async function GET() {
  await connectToDatabase();

  try {
    const packages = await Package.find({ isDeleted: { $ne: true } });

    if (packages.length === 0) {
      return NextResponse.json(
        { success: true, data: [], message: "No packages found." },
        { status: 200, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: packages },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("GET /api/package error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST create a package
export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();

    const { price, discount, discountedPrice, deposit, grandtotal, monthlyEarnings } = body;

    if (
      typeof price !== "string" ||
      typeof discount !== "string" ||
      typeof discountedPrice !== "string" ||
      typeof deposit !== "string" ||
      typeof grandtotal !== "string" ||
      typeof monthlyEarnings !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "All fields must be valid numbers." },
        { status: 400, headers: corsHeaders }
      );
    }

    const newPackage = await Package.create({
      price,
      discount,
      discountedPrice,
      deposit,
      grandtotal,
      monthlyEarnings,
    });

    return NextResponse.json(
      { success: true, data: newPackage, message: "Package created successfully." },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST /api/packages error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}
