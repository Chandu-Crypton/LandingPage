import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import About, { IAbout } from '@/models/About'; // Import your About model
import imagekit from '@/utils/imagekit';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is used for file names
import mongoose from 'mongoose';

// IMPORTANT: Define or import these as per your project setup
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};


export async function GET(req: Request) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing about ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {

        const about = await About.findById(id);

        if (!about) {
            return NextResponse.json(
                { success: false, message: 'About not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: about, message: 'About fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/about/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}






// export async function PUT(req: Request) {
//     await connectToDatabase();
//     const url = new URL(req.url);
//     const id = url.pathname.split("/").pop();

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//         return NextResponse.json(
//             { success: false, message: 'Invalid or missing ID.' },
//             { status: 400, headers: corsHeaders }
//         );
//     }



//     try {


//         const formData = await req.formData();

//         // Corrected: Allow string indexing on updateData for dynamic assignments
//         const updateData: Partial<IAbout> & { [key: string]: string | string[] } = {};

//         const title = formData.get('title');
//         const mainImage = formData.get('mainImage');
//         const bannerImage = formData.get('bannerImage');
//         const descriptionString = formData.get("description")?.toString();
//         const description: string[] =
//             descriptionString ? JSON.parse(descriptionString) : updateData.description;

//         const typeData = formData.get('typeData'); // Assuming typeData is a string field

//         if (title && typeof title === 'string') updateData.title = title;
//         if (description && typeof description === 'string') updateData.description = description;
//         if (typeData && typeof typeData === 'string') updateData.typeData = typeData;

//         // Handle mainImage file upload or URL
//         if (mainImage) { // Check if the mainImage field was provided at all
//             if (mainImage instanceof File) {
//                 if (mainImage.size > 0) {
//                     const buffer = Buffer.from(await mainImage.arrayBuffer());
//                     const uploadResponse = await imagekit.upload({
//                         file: buffer,
//                         fileName: `${uuidv4()}-${mainImage.name}`,
//                         folder: '/about-main-images',
//                     });
//                     if (uploadResponse.url) {
//                         updateData.mainImage = uploadResponse.url;
//                     } else {
//                         return NextResponse.json(
//                             { success: false, message: 'Failed to upload new main image to ImageKit.' },
//                             { status: 500, headers: corsHeaders }
//                         );
//                     }
//                 } else {
//                     // Empty file upload, means remove existing image
//                     updateData.mainImage = '';
//                     // OPTIONAL: Consider deleting the old image file from ImageKit here
//                 }
//             } else if (typeof mainImage === 'string' && mainImage.trim()) {
//                 // If it's a string, treat it as a URL
//                 updateData.mainImage = mainImage.trim();
//             } else if (mainImage === '') { // Explicitly sent empty string, means clear
//                 updateData.mainImage = '';
//                 // OPTIONAL: Consider deleting the old image file from ImageKit here
//             }
//         }


//         // Handle bannerImage file upload or URL
//         if (bannerImage) { // Check if the bannerImage field was provided at all
//             if (bannerImage instanceof File) {
//                 if (bannerImage.size > 0) {
//                     const buffer = Buffer.from(await bannerImage.arrayBuffer());
//                     const uploadResponse = await imagekit.upload({
//                         file: buffer,
//                         fileName: `${uuidv4()}-${bannerImage.name}`,
//                         folder: '/about-banner-images',
//                     });
//                     if (uploadResponse.url) {
//                         updateData.bannerImage = uploadResponse.url;
//                     } else {
//                         return NextResponse.json(
//                             { success: false, message: 'Failed to upload new banner image to ImageKit.' },
//                             { status: 500, headers: corsHeaders }
//                         );
//                     }
//                 } else {
//                     // Empty file upload, means remove existing image
//                     updateData.bannerImage = '';
//                     // OPTIONAL: Consider deleting the old image file from ImageKit here
//                 }
//             } else if (typeof bannerImage === 'string' && bannerImage.trim()) {
//                 // If it's a string, treat it as a URL
//                 updateData.bannerImage = bannerImage.trim();
//             } else if (bannerImage === '') { // Explicitly sent empty string, means clear
//                 updateData.bannerImage = '';
//                 // OPTIONAL: Consider deleting the old image file from ImageKit here
//             }
//         }

//         const updatedAboutEntry = await About.findByIdAndUpdate(
//             id,
//             { $set: updateData }, // Use $set to update only specified fields
//             { new: true, runValidators: true } // Return the updated document, run schema validators
//         ).lean(); // Use .lean() for plain object response

//         if (!updatedAboutEntry) {
//             return NextResponse.json(
//                 { success: false, message: 'About entry not found for update.' },
//                 { status: 404, headers: corsHeaders }
//             );
//         }

//         return NextResponse.json(
//             { success: true, data: updatedAboutEntry as IAbout, message: 'About entry updated successfully.' },
//             { status: 200, headers: corsHeaders }
//         );

//     } catch (error) {
//         console.error('PUT /api/about/[id] error:', error);
//         const message = error instanceof Error ? error.message : 'Internal Server Error';
//         return NextResponse.json(
//             { success: false, message },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }



export async function PUT(req: Request) {
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
        const formData = await req.formData();
        const updateData: Partial<IAbout> & { [key: string]: string | string[] } = {};

        const title = formData.get('title');
        const mainImage = formData.get('mainImage');
        const bannerImage = formData.get('bannerImage');
        const descriptionString = formData.get("description")?.toString();
        const typeData = formData.get('typeData');

        // Handle description - parse JSON string to array
        if (descriptionString) {
            try {
                const descriptionArray: string[] = JSON.parse(descriptionString);
                updateData.description = descriptionArray;
            } catch (parseError) {
                console.error('Error parsing description JSON:', parseError);
                return NextResponse.json(
                    { success: false, message: 'Invalid description format. Expected JSON array.' },
                    { status: 400, headers: corsHeaders }
                );
            }
        }

        // Handle other fields
        if (title && typeof title === 'string') updateData.title = title;
        if (typeData && typeof typeData === 'string') updateData.typeData = typeData;

        // Handle mainImage file upload or URL (your existing code is correct)
        if (mainImage) {
            if (mainImage instanceof File) {
                if (mainImage.size > 0) {
                    const buffer = Buffer.from(await mainImage.arrayBuffer());
                    const uploadResponse = await imagekit.upload({
                        file: buffer,
                        fileName: `${uuidv4()}-${mainImage.name}`,
                        folder: '/about-main-images',
                    });
                    if (uploadResponse.url) {
                        updateData.mainImage = uploadResponse.url;
                    } else {
                        return NextResponse.json(
                            { success: false, message: 'Failed to upload new main image to ImageKit.' },
                            { status: 500, headers: corsHeaders }
                        );
                    }
                } else {
                    updateData.mainImage = '';
                }
            } else if (typeof mainImage === 'string' && mainImage.trim()) {
                updateData.mainImage = mainImage.trim();
            } else if (mainImage === '') {
                updateData.mainImage = '';
            }
        }

        // Handle bannerImage file upload or URL (your existing code is correct)
        if (bannerImage) {
            if (bannerImage instanceof File) {
                if (bannerImage.size > 0) {
                    const buffer = Buffer.from(await bannerImage.arrayBuffer());
                    const uploadResponse = await imagekit.upload({
                        file: buffer,
                        fileName: `${uuidv4()}-${bannerImage.name}`,
                        folder: '/about-banner-images',
                    });
                    if (uploadResponse.url) {
                        updateData.bannerImage = uploadResponse.url;
                    } else {
                        return NextResponse.json(
                            { success: false, message: 'Failed to upload new banner image to ImageKit.' },
                            { status: 500, headers: corsHeaders }
                        );
                    }
                } else {
                    updateData.bannerImage = '';
                }
            } else if (typeof bannerImage === 'string' && bannerImage.trim()) {
                updateData.bannerImage = bannerImage.trim();
            } else if (bannerImage === '') {
                updateData.bannerImage = '';
            }
        }

        const updatedAboutEntry = await About.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedAboutEntry) {
            return NextResponse.json(
                { success: false, message: 'About entry not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedAboutEntry as IAbout, message: 'About entry updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/about/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
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

        const blogToDelete = await About.findById(id);

        if (!blogToDelete) {
            return NextResponse.json(
                { success: false, message: 'Blog not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }



        const deletedAbout = await About.findByIdAndDelete(id);

        if (!deletedAbout) {
            // This check might be redundant if blogToDelete already confirmed existence,
            // but keeps the pattern consistent for robustness.
            return NextResponse.json(
                { success: false, message: 'About could not be deleted (might have been removed already).' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: deletedAbout, message: 'About deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('DELETE /api/about/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}