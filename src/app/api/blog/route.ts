import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";
import mongoose from "mongoose";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET() {
    await connectToDatabase();

    try {

        const docs = await Blog.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Blog documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }


        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/blog error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}




// export async function POST(req: NextRequest) {
//     await connectToDatabase();

//     try {
//         const formData = await req.formData();
//         const blogHeading = formData.get('blogHeading');
//         const title = formData.get('title');
//         const mainImage = formData.get('mainImage');    
//         const description = formData.get('description');
//         const headingImage = formData.get('headingImage');
//         const items = formData.get('items');

//         if (typeof blogHeading !== 'string' || !blogHeading.trim() ||
//             typeof title !== 'string' || !title.trim() ||
//             typeof description !== 'string' || !description.trim() ||
//             typeof items !== 'string' || !items.trim()) {
//             return NextResponse.json(
//                 { success: false, message: 'Missing or invalid data for blog heading, title, description, or items.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         let mainImageUrl = '';
//         if (mainImage instanceof File && mainImage.size > 0) {
//             const buffer = Buffer.from(await mainImage.arrayBuffer());
//             const uploadResponse = await imagekit.upload({
//                 file: buffer,
//                 fileName: `${uuidv4()}-${mainImage.name}`,
//                 folder: '/blog-main-images',
//             });
//             if (uploadResponse.url) {
//                 mainImageUrl = uploadResponse.url;
//             } else {
//                 return NextResponse.json(
//                     { success: false, message: 'Failed to upload main image to ImageKit.' },
//                     { status: 500, headers: corsHeaders }
//                 );
//             }
//         } else {
//             return NextResponse.json(
//                 { success: false, message: 'Main Image file is required and must not be empty.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         let headingImageUrl = '';
//         if (headingImage instanceof File && headingImage.size > 0) {
//             const buffer = Buffer.from(await headingImage.arrayBuffer());
//             const uploadResponse = await imagekit.upload({
//                 file: buffer,
//                 fileName: `${uuidv4()}-${headingImage.name}`,
//                 folder: '/blog-heading-images',
//             });
//             if (uploadResponse.url) {
//                 headingImageUrl = uploadResponse.url;
//             } else {
//                 return NextResponse.json(
//                     { success: false, message: 'Failed to upload heading image to ImageKit.' },
//                     { status: 500, headers: corsHeaders }
//                 );
//             }
//         } else {
//             return NextResponse.json(
//                 { success: false, message: 'Heading Image file is required and must not be empty.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         let parsedItems;
//         try {
//             parsedItems = JSON.parse(items as string);
//             if (!Array.isArray(parsedItems) || !parsedItems.every(item => typeof item === 'object' && item !== null && 'itemTitle' in item && 'itemDescription' in item)) {
//                 return NextResponse.json(
//                     { success: false, message: 'Invalid format for "items" field. Expected an array of objects with itemTitle and itemDescription.' },
//                     { status: 400, headers: corsHeaders }
//                 );
//             }
//         } catch (error) {
//             console.error('POST /api/blog error:', error);
//             const message = error instanceof Error ? error.message : 'Invalid JSON format for "items" field.';
//             return NextResponse.json(
//                 { success: false, message },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         const newEntry = await Blog.create({
//             blogHeading: blogHeading as string,
//             title: title as string,
//             mainImage: mainImageUrl,
//             description: description as string,
//             headingImage: headingImageUrl, 
//             items: parsedItems,
//         });

//         return NextResponse.json(
//             { success: true, data: newEntry, message: 'Blog entry created successfully.' },
//             { status: 201, headers: corsHeaders }
//         );

//     } catch (error) {
//         console.error('POST /api/blog error:', error);
//         const message = error instanceof Error ? error.message : 'Internal Server Error';
//         return NextResponse.json(
//             { success: false, message },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const formData = await req.formData();
        console.log("Received form data:", formData);
        const addHeading = formData.get('addHeading')?.toString() || undefined; // Optional
        const blogHeading = formData.get('blogHeading')?.toString();
        const title = formData.get('title')?.toString();
        const description = formData.get('description')?.toString();
        const bestQuote = formData.get('bestQuote')?.toString();
        const category = formData.get('category')?.toString();
        const featured = formData.get('featured')?.toString() === 'true';
        const readtime = formData.get('readtime')?.toString();
        const tagsString = formData.get('tags')?.toString();
        const keyTechnologiesString = formData.get('keyTechnologies')?.toString();
        const mainImageFile = formData.get('mainImage') as File | null;
        const headingImageFile = formData.get('headingImage') as File | null;
        const itemsString = formData.get('items')?.toString();
   
        const tags: string[] = tagsString ? JSON.parse(tagsString) : [];


        let keyTechnologies: { itemTitle: string; itemPoints: string[]; itemDescription: string }[] = [];
        if (keyTechnologiesString) {
            try {
                const parsed = JSON.parse(keyTechnologiesString);

                // Always normalize to array
                const parsedArray = Array.isArray(parsed) ? parsed : [parsed];

                keyTechnologies = parsedArray.map(item => ({
                    itemTitle: item.itemTitle ? String(item.itemTitle).trim() : '',
                    itemPoints: Array.isArray(item.itemPoints)
                        ? item.itemPoints.map((point: string) => String(point).trim())
                        : [],
                    itemDescription: item.itemDescription ? String(item.itemDescription).trim() : '',
                })).filter(item => item.itemTitle !== '' || item.itemDescription !== '');
            } catch (jsonError) {
                console.error("Failed to parse keyTechnologies JSON:", jsonError);
                return NextResponse.json(
                    { success: false, message: 'Invalid format for keyTechnologies.' },
                    { status: 400, headers: corsHeaders }
                );
            }
        }




        let items: { itemTitle: string; itemDescription: string }[] = [];
        if (itemsString) {
            try {
                const parsedItems = JSON.parse(itemsString);
                if (Array.isArray(parsedItems)) {
                    items = parsedItems.map(item => ({
                        itemTitle: item.itemTitle ? String(item.itemTitle).trim() : '',
                        itemDescription: item.itemDescription ? String(item.itemDescription).trim() : '',
                    })).filter(item => item.itemTitle !== '' || item.itemDescription !== '');
                }
            } catch (jsonError) {
                console.error("Failed to parse items JSON:", jsonError);
                return NextResponse.json(
                    { success: false, message: 'Invalid format for blog items.' },
                    { status: 400, headers: corsHeaders }
                );
            }
        }

        // Basic validation for REQUIRED fields
        if (!blogHeading || !title || !description || !category ||  tags.length === 0 || !readtime || !bestQuote || (keyTechnologies.length === 0) || (items.length === 0)) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields (blogHeading, title, description, category, tags, keyTechnologies, or items).' },
                { status: 400, headers: corsHeaders }
            );
        }

        let mainImageUrl: string | undefined;
        if (mainImageFile && mainImageFile.size > 0) {
            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer, // Required
                fileName: mainImageFile.name, // Required
                folder: '/blog_images', // Optional, good for organization
            });
            mainImageUrl = uploadRes.url; // ImageKit public URL
        }

        let headingImageUrl: string | undefined;
        if (headingImageFile && headingImageFile.size > 0) {
            const buffer = Buffer.from(await headingImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: headingImageFile.name,
                folder: '/blog_images',
            });
            headingImageUrl = uploadRes.url; // ImageKit public URL
        }

        const newBlog = await Blog.create({
            addHeading,
            blogHeading,
            title,
            tags,
            featured,
            readtime,
            bestQuote,
            keyTechnologies,
            category,
            description,
            mainImage: mainImageUrl,
            headingImage: headingImageUrl,
            items,
        });

        return NextResponse.json(
            { success: true, data: newBlog, message: 'Blog created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/blog error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(err => (err as mongoose.Error.ValidatorError).message);
            return NextResponse.json(
                { success: false, message: 'Validation failed: ' + errors.join(', ') },
                { status: 400, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}