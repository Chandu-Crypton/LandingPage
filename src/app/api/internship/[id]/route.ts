import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Internship, { IInternship } from "@/models/Internship";
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
            { success: false, message: "Invalid or missing Internship ID." },
            { status: 400 }
        );
    }

    try {
        const formData = await req.formData();
        // console.log('Received formData data:', formData);
        const updateData: Partial<IInternship> = {};

        // --- Text Fields ---
        const textFields = [
           "internshipType", "title", "subtitle", "fee", "description", "mode", "duration", "durationDetails",
            "stipend", "schedule", "enrolledStudents", "mentorship", "internship", "level",
            "projects", "syllabusLink", "category", "rating"
        ];

        textFields.forEach((field) => {
            const value = formData.get(field);
            // Only update if the field was actually provided (not just empty string)
            if (value !== null && value !== undefined) {
                const stringValue = value.toString();
                if (stringValue !== "") {
                    updateData[field as keyof IInternship] = stringValue;
                } else if (stringValue === "") {
                    // Handle empty string as null/undefined if appropriate
                    updateData[field as keyof IInternship] = undefined;
                }
            }
        });

        // --- Simple Arrays ---
        const arrayFields = ["tags", "benefits", "eligibility", "learningOutcomes"];
        for (const field of arrayFields) {
            const value = formData.get(field);
            if (value !== null && value !== undefined) {
                try {
                    const parsed = JSON.parse(value.toString());
                    if (Array.isArray(parsed)) {
                        updateData[field as keyof IInternship] = parsed
                            .map((v: string) => v.trim())
                            .filter(Boolean);
                    } else {
                        throw new Error(`${field} should be a JSON array`);
                    }
                } catch (error) {
                    console.error(`Error parsing ${field}:`, error);
                    return NextResponse.json(
                        { success: false, message: `Invalid JSON format for ${field}` },
                        { status: 400 }
                    );
                }
            }
        }

        // --- Nested Arrays with Icons ---
        const handleNestedArrayWithIcons = async (
            fieldName: "skills" | "tool" | "curriculum" | "summary",
            iconFieldBase: string,
            folder: string
        ) => {
            const value = formData.get(fieldName);
            if (!value) return;

            let parsedArray;
            try {
                parsedArray = JSON.parse(value.toString());
                if (!Array.isArray(parsedArray)) throw new Error(`${fieldName} should be an array`);
            } catch (error) {
                console.error(`Error parsing ${fieldName}:`, error);
                return NextResponse.json(
                    { success: false, message: `Invalid JSON for ${fieldName}` },
                    { status: 400 }
                );
            }

            // Get the existing internship to preserve existing icons
            const existingInternship = await Internship.findById(id);
            if (!existingInternship) {
                throw new Error("Internship not found");
            }

            const existingArray = existingInternship[fieldName] || [];
            const finalArray = [];

            for (let i = 0; i < parsedArray.length; i++) {
                const item = parsedArray[i];
                const existingItem = existingArray[i] || {};

                // Validate required fields for each item type
                if (fieldName === "skills" && (!item.skillTitle || typeof item.skillTitle !== 'string')) {
                    throw new Error(`Invalid skill item at index ${i}`);
                }
                if (fieldName === "tool" && (!item.toolTitle || typeof item.toolTitle !== 'string')) {
                    throw new Error(`Invalid tool item at index ${i}`);
                }
                if (fieldName === "curriculum" && (!item.currTitle || typeof item.currTitle !== 'string')) {
                    throw new Error(`Invalid curriculum item at index ${i}`);
                }
                if (fieldName === "summary" && (!item.sumTitle || typeof item.sumTitle !== 'string')) {
                    throw new Error(`Invalid summary item at index ${i}`);
                }

                const file = formData.get(`${iconFieldBase}_${i}`);

                // Handle file upload
                if (file instanceof File && file.size > 0) {
                    try {
                        const buffer = Buffer.from(await file.arrayBuffer());
                        const uploadRes = await imagekit.upload({
                            file: buffer,
                            fileName: `${uuidv4()}-${file.name}`,
                            folder,
                        });

                        if (fieldName === "skills") item.skillIcon = uploadRes.url;
                        if (fieldName === "tool") item.toolIcon = uploadRes.url;
                        if (fieldName === "curriculum") item.currIcon = uploadRes.url;
                        if (fieldName === "summary") item.icon = uploadRes.url;
                    } catch (uploadError) {
                        console.error(`Error uploading ${fieldName} icon:`, uploadError);
                        throw new Error(`Failed to upload ${fieldName} icon`);
                    }
                } else if (file === "null" || file === null) {
                    // Handle icon removal
                    if (fieldName === "skills") item.skillIcon = "";
                    if (fieldName === "tool") item.toolIcon = "";
                    if (fieldName === "curriculum") item.currIcon = "";
                    if (fieldName === "summary") item.icon = "";
                } else {
                    // Preserve existing icon if no new file is provided and file is not explicitly null
                    if (fieldName === "skills") item.skillIcon = existingItem.skillIcon || "";
                    if (fieldName === "tool") item.toolIcon = existingItem.toolIcon || "";
                    if (fieldName === "curriculum") item.currIcon = existingItem.currIcon || "";
                    if (fieldName === "summary") item.icon = existingItem.icon || "";
                }

                finalArray.push(item);
            }

            if (finalArray.length > 0) {
                updateData[fieldName as keyof IInternship] = finalArray;
            } else {
                // If empty array is provided, set to empty array
                updateData[fieldName as keyof IInternship] = [];
            }
        };

        // Process nested arrays
        try {
            await handleNestedArrayWithIcons("skills", "skillIcon", "/internship-skills");
            await handleNestedArrayWithIcons("tool", "toolIcon", "/internship-tools");
            await handleNestedArrayWithIcons("curriculum", "currIcon", "/internship-curriculum");
            await handleNestedArrayWithIcons("summary", "summaryIcon", "/internship-summary");
        } catch (error) {
            return NextResponse.json(
                { success: false, message: error instanceof Error ? error.message : "Error processing nested arrays" },
                { status: 400 }
            );
        }

        // --- Images ---
        const handleImage = async (fieldName: string, folder: string) => {
            const file = formData.get(fieldName);
            console.log(`Processing ${fieldName}:`, file, typeof file);

            // If no file field is provided at all (null), preserve existing image
            if (file === null) {
                console.log(`No ${fieldName} provided - preserving existing image`);
                return; // Don't add to updateData, preserve existing
            }

            // If it's a File with actual content, upload it
            if (file instanceof File) {
                if (file.size > 0) {
                    try {
                        const buffer = Buffer.from(await file.arrayBuffer());
                        const uploadRes = await imagekit.upload({
                            file: buffer,
                            fileName: `${uuidv4()}-${file.name}`,
                            folder,
                        });
                        updateData[fieldName as keyof IInternship] = uploadRes.url;
                        console.log(`Uploaded new ${fieldName}`);
                    } catch (uploadError) {
                        console.error(`Error uploading ${fieldName}:`, uploadError);
                        throw new Error(`Failed to upload ${fieldName}`);
                    }
                } else {
                    // Empty file - remove the image
                    updateData[fieldName as keyof IInternship] = "";
                    console.log(`Removed ${fieldName} (empty file)`);
                }
            }
            // If it's explicitly "null" string, remove the image
            else if (file === "null") {
                updateData[fieldName as keyof IInternship] = "";
                console.log(`Explicitly removed ${fieldName}`);
            }
            // If it's a URL string (existing image), preserve it
            else if (typeof file === 'string' && file.startsWith('http')) {
                console.log(`Preserving existing ${fieldName} URL`);
                // Don't add to updateData - preserve existing value
            }
            // For any other case (empty string, undefined, etc.), preserve existing
            else {
                console.log(`Preserving existing ${fieldName} (other case)`);
                // Don't add to updateData - preserve existing value
            }
        };

        try {
            await handleImage("mainImage", "/internship-main-images");
            await handleImage("bannerImage", "/internship-banner-images");
        } catch (error) {
            return NextResponse.json(
                { success: false, message: error instanceof Error ? error.message : "Error processing images" },
                { status: 400 }
            );
        }

        // --- If nothing to update ---
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: "No valid fields provided for update." },
                { status: 400 }
            );
        }

        // --- Update in DB ---
        const updatedInternship = await Internship.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

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
        console.error(`PUT /api/internship/${id} error:`, error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { success: false, message },
            { status: 500 }
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