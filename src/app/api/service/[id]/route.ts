import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import ServiceModel from "@/models/Service";
import imagekit from "@/utils/imagekit";
// import { v4 as uuidv4 } from 'uuid';
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
    const doc = await ServiceModel.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Service not found.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/service/${id} error:`, error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}


// export async function PUT(req: NextRequest) {
//     await connectToDatabase();

//     const url = new URL(req.url);
//     const id = url.pathname.split("/").pop();

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//         return NextResponse.json(
//             { success: false, message: "Invalid or missing Blog ID." },
//             { status: 400, headers: corsHeaders }
//         );
//     }

//     try {
//         const formData = await req.formData();
//         const updateData: Partial<IService> = {}; // Partial<IService>

       
//         const title = formData.get("title")?.toString();

//         if (title) updateData.title = title;

//        // --- Description ---
//        const descriptionString = formData.get("description")?.toString();
//         if (descriptionString) {
//             try {
//                 const parsedDescription = JSON.parse(descriptionString);
//                 if (Array.isArray(parsedDescription)) {
//                     updateData.description = parsedDescription.map((d: string) => d.trim()).filter(Boolean);
//                 } else {
//                     return NextResponse.json(
//                         { success: false, message: "Description should be a JSON array of strings." },
//                         { status: 400, headers: corsHeaders }
//                     );
//                 }
//             } catch {
//                 return NextResponse.json(
//                     { success: false, message: "Invalid JSON format for tags." },
//                     { status: 400, headers: corsHeaders }
//                 );
//             }
//         }


//         // --- Main Image ---
//         const mainImageFile = formData.get("mainImage");
//         if (mainImageFile instanceof File && mainImageFile.size > 0) {
//             const buffer = Buffer.from(await mainImageFile.arrayBuffer());
//             const uploadRes = await imagekit.upload({
//                 file: buffer,
//                 fileName: `${uuidv4()}-${mainImageFile.name}`,
//                 folder: "/service-main-images",
//             });
//             updateData.mainImage = uploadRes.url;
//         } else if (mainImageFile === "null" || mainImageFile === "") {
//             updateData.mainImage = "";
//         }
       
//         // --- Banner Image ---
//         const bannerImageFile = formData.get("bannerImage");
//         if (bannerImageFile instanceof File && bannerImageFile.size > 0) {
//             const buffer = Buffer.from(await bannerImageFile.arrayBuffer());
//             const uploadRes = await imagekit.upload({
//                 file: buffer,
//                 fileName: `${uuidv4()}-${bannerImageFile.name}`,
//                 folder: "/service-banner-images",
//             });
//             updateData.bannerImage = uploadRes.url;
//         } else if (bannerImageFile === "null" || bannerImageFile === "") {
//             updateData.bannerImage = "";
//         }
        

//         // --- Check if anything to update ---
//         if (Object.keys(updateData).length === 0) {
//             return NextResponse.json(
//                 { success: false, message: "No valid fields provided for update." },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         const updatedService = await ServiceModel.findByIdAndUpdate(
//             id,
//             { $set: updateData },
//             { new: true, runValidators: true }
//         );

//         if (!updatedService) {
//             return NextResponse.json(
//                 { success: false, message: "Service entry not found for update." },
//                 { status: 404, headers: corsHeaders }
//             );
//         }

//         return NextResponse.json(
//             { success: true, data: updatedService, message: "Service entry updated successfully." },
//             { status: 200, headers: corsHeaders }
//         );

//     } catch (error) {
//         console.error(`PUT /api/service/${id} error:`, error);
//         const message = error instanceof Error ? error.message : "Internal Server Error";
//         return NextResponse.json(
//             { success: false, message },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }


export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const formData = await req.formData();
  

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing Service ID." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find existing service
    const existingService = await ServiceModel.findById(id);
    if (!existingService) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Helpers: upload file if exists
    const uploadIfExists = async (file: File | null, oldValue?: string) => {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadRes = await imagekit.upload({
          file: buffer,
          fileName: file.name,
          folder: "/service_images",
        });
        return uploadRes.url;
      }
      return oldValue;
    };

    // Basic fields
    const title = formData.get("title")?.toString() || existingService.title;
    const descriptionString = formData.get("description")?.toString();
    const description: string[] =
      descriptionString ? JSON.parse(descriptionString) : existingService.description;

    // Files
    const mainImageFile = formData.get("mainImage") as File | null;
    const bannerImageFile = formData.get("bannerImage") as File | null;
    const serviceImage1File = formData.get("serviceImage1") as File | null;
    const serviceImage2File = formData.get("serviceImage2") as File | null;

    const mainImage = await uploadIfExists(mainImageFile, existingService.mainImage);
    const bannerImage = await uploadIfExists(bannerImageFile, existingService.bannerImage);
    const serviceImage1 = await uploadIfExists(serviceImage1File, existingService.serviceImage1);
    const serviceImage2 = await uploadIfExists(serviceImage2File, existingService.serviceImage2);

    // ✅ Fix process handling
    const processString = formData.get("process")?.toString();
    const process =
      processString && processString.length > 0
        ? JSON.parse(processString).map(
            (p: { title?: string; description?: string }) => ({
              title: p.title?.toString().trim() || "",
              description: p.description?.toString().trim() || "",
            })
          )
        : existingService.process;

    // Arrays
    const serviceArrayString = formData.get("service")?.toString();
    const serviceArray = serviceArrayString
      ? JSON.parse(serviceArrayString)
      : existingService.service;

    const technologyString = formData.get("technology")?.toString();
    const technology = technologyString
      ? JSON.parse(technologyString)
      : existingService.technology;

    const whyChooseUsString = formData.get("whyChooseUs")?.toString();
    const whyChooseUs = whyChooseUsString
      ? JSON.parse(whyChooseUsString)
      : existingService.whyChooseUs;

    // Update doc
    const updatedService = await ServiceModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        mainImage,
        bannerImage,
        serviceImage1,
        serviceImage2,
        process,
        service: serviceArray,
        technology,
        whyChooseUs,
      },
      { new: true }
    );

    return NextResponse.json(
      { success: true, data: updatedService, message: "Service updated successfully." },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("PUT /api/service/:id error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";

    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(
        (err) => (err as mongoose.Error.ValidatorError).message
      );
      return NextResponse.json(
        { success: false, message: "Validation failed: " + errors.join(", ") },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: false, message }, { status: 500, headers: corsHeaders });
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
        const deletedDoc = await ServiceModel.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Service document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Service content deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/service/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}