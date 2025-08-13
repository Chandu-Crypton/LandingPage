import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";

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

//         const title = formData.get('title');
//         const mainImage = formData.get('mainImage');
//         const description = formData.get('description');
//         const headingImage = formData.get('headingImage');
//         const items = formData.get('items'); 


//         if (!title || !description || !items) {
//             return NextResponse.json(
//                 { success: false, message: 'Missing required text fields (title, description, items).' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }


//         if (typeof title !== 'string' || typeof description !== 'string' || typeof items !== 'string') {
//              return NextResponse.json(
//                 { success: false, message: 'Invalid data format for text fields.' },
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
//         // Use a type guard to check if headingImage is indeed a File
//         if (headingImage instanceof File && headingImage.size > 0) {
//             const buffer = Buffer.from(await headingImage.arrayBuffer());

//             const uploadResponse = await imagekit.upload({
//                 file: buffer,
//                 fileName: `${uuidv4()}-${headingImage.name}`, // Use headingImage.name
//                 folder: '/blog-heading-images', // More descriptive folder name
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
//              return NextResponse.json(
//                 { success: false, message: 'Heading Image file is required and must not be empty.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }


//         const newEntry = await Blog.create({
//             title,
//             mainImage: mainImageUrl,
//             description,
//             headingImage: headingImageUrl,
//             items: JSON.parse(items as string), 
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

        const title = formData.get('title');
        const mainImage = formData.get('mainImage');
        const description = formData.get('description');
        const headingImage = formData.get('headingImage');
        const items = formData.get('items');

        if (typeof title !== 'string' || !title.trim() ||
            typeof description !== 'string' || !description.trim() ||
            typeof items !== 'string' || !items.trim()) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid data for title, description, or items.' },
                { status: 400, headers: corsHeaders }
            );
        }

        let mainImageUrl = '';
        if (mainImage instanceof File && mainImage.size > 0) {
            const buffer = Buffer.from(await mainImage.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${mainImage.name}`,
                folder: '/blog-main-images',
            });
            if (uploadResponse.url) {
                mainImageUrl = uploadResponse.url;
            } else {
                return NextResponse.json(
                    { success: false, message: 'Failed to upload main image to ImageKit.' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else {
            return NextResponse.json(
                { success: false, message: 'Main Image file is required and must not be empty.' },
                { status: 400, headers: corsHeaders }
            );
        }

        let headingImageUrl = '';
        if (headingImage instanceof File && headingImage.size > 0) {
            const buffer = Buffer.from(await headingImage.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${headingImage.name}`,
                folder: '/blog-heading-images',
            });
            if (uploadResponse.url) {
                headingImageUrl = uploadResponse.url;
            } else {
                return NextResponse.json(
                    { success: false, message: 'Failed to upload heading image to ImageKit.' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else {
            return NextResponse.json(
                { success: false, message: 'Heading Image file is required and must not be empty.' },
                { status: 400, headers: corsHeaders }
            );
        }

        let parsedItems;
        try {
            parsedItems = JSON.parse(items as string);
            if (!Array.isArray(parsedItems) || !parsedItems.every(item => typeof item === 'object' && item !== null && 'itemTitle' in item && 'itemDescription' in item)) {
                return NextResponse.json(
                    { success: false, message: 'Invalid format for "items" field. Expected an array of objects with itemTitle and itemDescription.' },
                    { status: 400, headers: corsHeaders }
                );
            }
        } catch (error) {
            console.error('POST /api/blog error:', error);
            const message = error instanceof Error ? error.message : 'Invalid JSON format for "items" field.';
            return NextResponse.json(
                { success: false, message },
                { status: 400, headers: corsHeaders }
            );
        }

        const newEntry = await Blog.create({
            title: title as string,
            mainImage: mainImageUrl,
            description: description as string,
            HeadingImage: headingImageUrl, // Corrected casing
            items: parsedItems,
        });

        return NextResponse.json(
            { success: true, data: newEntry, message: 'Blog entry created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/blog error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
