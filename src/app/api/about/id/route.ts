import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import About from "@/models/About";


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const updates = await req.json();
    const allowedFields = ['content', 'version', 'isActive', 'isDeleted'];
    const filtered: any = {};
    allowedFields.forEach(f => { if (updates[f] !== undefined) filtered[f] = updates[f]; });
    const updated = await About.findByIdAndUpdate(id, filtered, { new: true });
    if (!updated) return NextResponse.json({ message: 'About page not found' }, { status: 404, headers: corsHeaders });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: 'Error updating about page', error: err }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const deleted = await About.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false },
      { new: true }
    );
    if (!deleted) return NextResponse.json({ message: 'About page not found' }, { status: 404, headers: corsHeaders });
    return NextResponse.json({ message: 'About page deleted', data: deleted });
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting about page', error: err }, { status: 500, headers: corsHeaders });
  }
}