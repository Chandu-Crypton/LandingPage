import {  NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import FBlogModal from "@/models/FBlog";
import mongoose from "mongoose";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET(req: Request) {
    await connectToDatabase();

    const url = new URL(req.url);
    const identifier = url.pathname.split("/").pop();

    if (!identifier) {
        return NextResponse.json(
            { success: false, message: 'Blog identifier is required.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        let doc;

        // Check if the identifier is a valid MongoDB ObjectId
        const isObjectId = mongoose.Types.ObjectId.isValid(identifier) && 
                          new mongoose.Types.ObjectId(identifier).toString() === identifier;

        if (isObjectId) {
            // Search by ID
            doc = await FBlogModal.findById(identifier);
        } else {
            // Convert URL slug back to title format for proper matching
            const titleFromSlug = identifier
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            console.log('Searching for title:', titleFromSlug); // Debug log
            
            // Search by title - CASE INSENSITIVE
            doc = await FBlogModal.findOne({ 
                title: { $regex: new RegExp(`^${titleFromSlug}$`, 'i') } 
            });
        }

        if (!doc) {
            console.log('No document found for:', identifier); // Debug log
            return NextResponse.json(
                { success: false, message: 'Blog not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: doc },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error(`GET /api/fblog/${identifier} error:`, error);
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
    const identifier = url.pathname.split("/").pop();

    // Check if identifier is undefined or empty
    if (!identifier) {
        return NextResponse.json(
            { success: false, message: 'Blog identifier is required.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        const body = await req.json();
        let doc;

        const isObjectId = mongoose.Types.ObjectId.isValid(identifier) && 
                          new mongoose.Types.ObjectId(identifier).toString() === identifier;

        if (isObjectId) {
            doc = await FBlogModal.findByIdAndUpdate(identifier, body, { new: true, runValidators: true });
        } else {
            doc = await FBlogModal.findOneAndUpdate({ slug: identifier }, body, { new: true, runValidators: true });
        }

        if (!doc) {
            return NextResponse.json(
                { success: false, message: 'Blog not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: doc },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error(`PUT /api/fblog/${identifier} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function DELETE(req: Request) {
    await connectToDatabase();

    const url = new URL(req.url);
    const identifier = url.pathname.split("/").pop();

    // Check if identifier is undefined or empty
    if (!identifier) {
        return NextResponse.json(
            { success: false, message: 'Blog identifier is required.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        let doc;

        const isObjectId = mongoose.Types.ObjectId.isValid(identifier) && 
                          new mongoose.Types.ObjectId(identifier).toString() === identifier;

        if (isObjectId) {
            doc = await FBlogModal.findByIdAndDelete(identifier);
        } else {
            doc = await FBlogModal.findOneAndDelete({ slug: identifier });
        }

        if (!doc) {
            return NextResponse.json(
                { success: false, message: 'Blog not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Blog deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error(`DELETE /api/fblog/${identifier} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}