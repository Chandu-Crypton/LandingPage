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
//             { success: false, message: 'Invalid or missing About ID.' },
//             { status: 400, headers: corsHeaders }
//         );
//     }

//     try {
     
//         const formData = await req.formData();

//         const title = formData.get('title');
//         const mainImage = formData.get('mainImage');
//         const description = formData.get('description');
//         const typeData = formData.get('typeData');
       
        
//           const updateData: Partial<IAbout> = {}; 
//         if (title && typeof title === 'string') updateData.title = title;
//         if (description && typeof description === 'string') updateData.description = description;
//         if (typeData && typeof typeData === 'string') updateData.typeData = typeData;

       
//         if (mainImage instanceof File) {
          
//             if (mainImage.size > 0) {
//                 const buffer = Buffer.from(await mainImage.arrayBuffer());
//                 const uploadResponse = await imagekit.upload({
//                     file: buffer,
//                     fileName: `${uuidv4()}-${mainImage.name}`,
//                     folder: '/about-main-images',
//                 });
//                 if (uploadResponse.url) {
//                     updateData.mainImage = uploadResponse.url;
//                 } else {
//                     return NextResponse.json(
//                         { success: false, message: 'Failed to upload new main image to ImageKit.' },
//                         { status: 500, headers: corsHeaders }
//                     );
//                 }
//             } else {
            
//                 updateData.mainImage = '';
                
//             }
//         } else if (mainImage === '') {
            
//             updateData.mainImage = '';
            
//         }
       

//         // Find and update the blog entry
//         const updatedBlog = await About.findByIdAndUpdate(
//             id,
//             { $set: updateData }, // Use $set to update only specified fields
//             { new: true, runValidators: true } // Return the updated document, run schema validators
//         );

//         if (!updatedBlog) {
//             return NextResponse.json(
//                 { success: false, message: 'Blog not found for update.' },
//                 { status: 404, headers: corsHeaders }
//             );
//         }

//         return NextResponse.json(
//             { success: true, data: updatedBlog, message: 'Blog updated successfully.' },
//             { status: 200, headers: corsHeaders }
//         );

//     } catch (error) {
//         console.error('PUT /api/blog/[id] error:', error);
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

        // Corrected: Allow string indexing on updateData for dynamic assignments
        const updateData: Partial<IAbout> & { [key: string]: string | string[] } = {};

        const title = formData.get('title');
        const mainImage = formData.get('mainImage');
        const description = formData.get('description');
        const typeData = formData.get('typeData'); // Assuming typeData is a string field

        if (title && typeof title === 'string') updateData.title = title;
        if (description && typeof description === 'string') updateData.description = description;
        if (typeData && typeof typeData === 'string') updateData.typeData = typeData;

        // Handle mainImage file upload or URL
        if (mainImage) { // Check if the mainImage field was provided at all
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
                    // Empty file upload, means remove existing image
                    updateData.mainImage = '';
                    // OPTIONAL: Consider deleting the old image file from ImageKit here
                }
            } else if (typeof mainImage === 'string' && mainImage.trim()) {
                // If it's a string, treat it as a URL
                updateData.mainImage = mainImage.trim();
            } else if (mainImage === '') { // Explicitly sent empty string, means clear
                updateData.mainImage = '';
                // OPTIONAL: Consider deleting the old image file from ImageKit here
            }
        }
      
        const updatedAboutEntry = await About.findByIdAndUpdate(
            id,
            { $set: updateData }, // Use $set to update only specified fields
            { new: true, runValidators: true } // Return the updated document, run schema validators
        ).lean(); // Use .lean() for plain object response

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

        // OPTIONAL: Delete images from ImageKit
        // if (blogToDelete.mainImage) {
        //     // You would need to store ImageKit file IDs in your schema
        //     // or derive them from URLs to delete. This is a placeholder.
        //     // Example: await imagekit.deleteFile(blogToDelete.mainImageFileId);
        //     console.log(`Deleting main image from ImageKit: ${blogToDelete.mainImage}`);
        // }
        // if (blogToDelete.headingImage) {
        //     console.log(`Deleting heading image from ImageKit: ${blogToDelete.headingImage}`);
        // }

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