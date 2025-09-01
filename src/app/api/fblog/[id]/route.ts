import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import FBlogModal, { IFBlog } from "@/models/FBlog";
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
    const doc = await FBlogModal.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Fetch Blog not found.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/fblog/${id} error:`, error);
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
        const updateData: Partial<IFBlog> = {}; // Partial<IFBlog>

        // --- Text Fields ---
        const addHeading = formData.get("addHeading")?.toString();
        const blogHeading = formData.get("blogHeading")?.toString();
        const title = formData.get("title")?.toString();
        const description = formData.get("description")?.toString();
        const readtime = formData.get("readtime")?.toString();
        const featured = formData.get("featured") === 'true';
        const category = formData.get("category")?.toString();
        const bestQuote = formData.get("bestQuote")?.toString();

        if (addHeading !== undefined) updateData.addHeading = addHeading;
        if (blogHeading) updateData.blogHeading = blogHeading;
        if (title) updateData.title = title;
        if(featured) updateData.featured = featured;
        if (description) updateData.description = description;
        if (readtime) updateData.readtime = readtime;
        if (category) updateData.category = category;
        if (bestQuote) updateData.bestQuote = bestQuote;

        // --- Tags ---
        const tagsString = formData.get("tags")?.toString();
        if (tagsString) {
            try {
                const parsedTags = JSON.parse(tagsString);
                if (Array.isArray(parsedTags)) {
                    updateData.tags = parsedTags.map((t: string) => t.trim()).filter(Boolean);
                } else {
                    return NextResponse.json(
                        { success: false, message: "Tags should be a JSON array of strings." },
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

        // --- Items ---
        const itemsString = formData.get("items")?.toString();
        if (itemsString) {
            try {
                const parsedItems = JSON.parse(itemsString);
                if (Array.isArray(parsedItems)) {
                    updateData.items = parsedItems.map((item: { itemTitle?: string; itemDescription?: string | string[] }) => ({
                        itemTitle: item.itemTitle?.toString().trim() || "",
                        itemDescription: Array.isArray(item.itemDescription)
                            ? item.itemDescription.map((d: string) => d.trim())
                            : [item.itemDescription?.toString().trim() || ""],
                    })).filter(it => it.itemTitle || it.itemDescription.length);
                } else {
                    return NextResponse.json(
                        { success: false, message: "Items should be a JSON array of objects." },
                        { status: 400, headers: corsHeaders }
                    );
                }
            } catch {
                return NextResponse.json(
                    { success: false, message: "Invalid JSON format for items." },
                    { status: 400, headers: corsHeaders }
                );
            }
        }

        // --- Key Technologies ---
        const keyTechString = formData.get("keyTechnologies")?.toString();
        if (keyTechString) {
            try {
                const parsed = JSON.parse(keyTechString);
                const parsedArray = Array.isArray(parsed) ? parsed : [parsed];
                updateData.keyTechnologies = parsedArray.map((item: { itemTitle?: string; itemDescription?: string; itemPoints?: string[] }) => ({
                    itemTitle: item.itemTitle?.toString().trim() || "",
                    itemDescription: item.itemDescription?.toString().trim() || "",
                    itemPoints: Array.isArray(item.itemPoints)
                        ? item.itemPoints.map((p: string) => p.trim())
                        : [],
                }));
            } catch {
                return NextResponse.json(
                    { success: false, message: "Invalid JSON format for keyTechnologies." },
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
                folder: "/blog-main-images",
            });
            updateData.mainImage = uploadRes.url;
        } else if (mainImageFile === "null" || mainImageFile === "") {
            updateData.mainImage = "";
        }

        // --- Heading Image ---
        const headingImageFile = formData.get("headingImage");
        if (headingImageFile instanceof File && headingImageFile.size > 0) {
            const buffer = Buffer.from(await headingImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${headingImageFile.name}`,
                folder: "/blog-heading-images",
            });
            updateData.headingImage = uploadRes.url;
        } else if (headingImageFile === "null" || headingImageFile === "") {
            updateData.headingImage = "";
        }

        // --- Check if anything to update ---
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: "No valid fields provided for update." },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedBlog = await FBlogModal.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return NextResponse.json(
                { success: false, message: "Blog entry not found for update." },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedBlog, message: "Blog entry updated successfully." },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`PUT /api/fblog/${id} error:`, error);
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
        const deletedDoc = await FBlogModal.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Fetch Blog document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Fetch Blog content deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/fblog/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}