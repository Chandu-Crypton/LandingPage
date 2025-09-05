import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Package, { IPackage } from '@/models/Packages';
import mongoose from 'mongoose';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ---------------- GET by ID ----------------
export async function GET(req: Request) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: 'Invalid or missing Package ID.' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const pkg = await Package.findById(id);

    if (!pkg) {
      return NextResponse.json(
        { success: false, message: 'Package not found.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: pkg, message: 'Package fetched successfully.' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET /api/package/[id] error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ---------------- PUT (Update) ----------------
export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: 'Invalid or missing Package ID.' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const { price, discount, discountedPrice, deposit, grandtotal, monthlyEarnings } = body;

    const updateData: Partial<IPackage> = {};
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    if (discountedPrice !== undefined) updateData.discountedPrice = discountedPrice;
    if (deposit !== undefined) updateData.deposit = deposit;
    if (grandtotal !== undefined) updateData.grandtotal = grandtotal;
    if (monthlyEarnings !== undefined) updateData.monthlyEarnings = monthlyEarnings;

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return NextResponse.json(
        { success: false, message: 'Package not found for update.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedPackage, message: 'Package updated successfully.' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('PUT /api/package/[id] error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ---------------- DELETE ----------------
export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: 'Invalid or missing Package ID.' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return NextResponse.json(
        { success: false, message: 'Package not found for deletion.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedPackage, message: 'Package deleted successfully.' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('DELETE /api/package/[id] error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
