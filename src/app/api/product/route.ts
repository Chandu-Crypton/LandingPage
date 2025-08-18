
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/utils/db'; 
// import Product, { IProduct } from '@/models/Product'; 
// import imagekit from '@/utils/imagekit';
// import { v4 as uuidv4 } from 'uuid';


// const corsHeaders = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// };



// export interface IProductCore {
//     _id?: string;
//     titleA: string;
//     titleB: string;
//     heading: string;
//     description: string;
//     videoFile: string;
//     franchiseData: string;
//     efficiency: string;
//     rating: string;
//     productControls: {
//         productTitle: string;
//         productIcon: string; 
//         productDescription: string;
//     }[];
//     keyFeatures: {
//         featureTitle: string;
//         featureIcon: string;
//         featureDescription: string;
//     }[];
//     screenshot: {
//         screenshotImage: string;
//     }[];
//     isDeleted?: boolean;
//     createdAt?: string;
//     updatedAt?: string;
//     __v?: number;
// }


// export async function GET() {
//     await connectToDatabase();

//     try {
//         const products = await Product.find({ isDeleted: { $ne: true } }).lean(); 
        
//         return NextResponse.json(
//             { success: true, data: products, message: 'Products fetched successfully.' },
//             { status: 200, headers: corsHeaders }
//         );

//     } catch (error) {
//         console.error('GET /api/product error:', error);
//         const message = error instanceof Error ? error.message : 'Internal Server Error';
//         return NextResponse.json(
//             { success: false, message },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }

// export async function POST(req: NextRequest) {
//     await connectToDatabase();

//     try {
//         const formData = await req.formData();
//         console.log('Received formData:', formData);
        
//         const heading = formData.get('heading');
//         const title = formData.get('title');
//         const subHeading = formData.get('subHeading');
//         const description = formData.get('description');
//         const franchiseData = formData.get('franchiseData');
//         const efficiency = formData.get('efficiency');
//         const rating = formData.get('rating');

//         // Extracting JSON stringified array fields
//         const productControlsJson = formData.get('productControls');
//         const keyFeaturesJson = formData.get('keyFeatures');
//         const screenshotJson = formData.get('screenshot');

//         // Extracting file field
//         const videoFile = formData.get('videoFile');

//         // 1. Input Validation for required string fields
//         if (
//             typeof title !== 'string' || !title.trim() ||
//             typeof heading !== 'string' || !heading.trim() ||
//             typeof subHeading !== 'string' || !subHeading.trim() ||
//             typeof description !== 'string' || !description.trim() ||
//             typeof franchiseData !== 'string' || !franchiseData.trim() ||
//             typeof efficiency !== 'string' || !efficiency.trim() ||
//             typeof rating !== 'string' || !rating.trim()
//         ) {
//             return NextResponse.json(
//                 { success: false, message: 'Missing or invalid data for required text fields.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//        let videoFileUrl = '';
//         if (typeof videoFile === 'string' && videoFile.trim()) {
         
//             videoFileUrl = videoFile.trim();
//         } else if (videoFile instanceof File && videoFile.size > 0) {
           
//             const buffer = Buffer.from(await videoFile.arrayBuffer());
//             const uploadResponse = await imagekit.upload({
//                 file: buffer,
//                 fileName: `${uuidv4()}-${videoFile.name}`,
//                 folder: '/product-videos',
//             });
//             if (uploadResponse.url) {
//                 videoFileUrl = uploadResponse.url;
//             } else {
//                 return NextResponse.json(
//                     { success: false, message: 'Failed to upload video file to ImageKit.' },
//                     { status: 500, headers: corsHeaders }
//                 );
//             }
//         } else {
            
//             return NextResponse.json(
//                 { success: false, message: 'Video file (URL or actual file) is required and must not be empty.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         // 3. Parse JSON stringified array fields and validate their structure
//         let parsedProductControls: IProduct['productControls'] = [];
//         try {
//             if (productControlsJson && typeof productControlsJson === 'string') {
//                 parsedProductControls = JSON.parse(productControlsJson);
//                 if (!Array.isArray(parsedProductControls) || !parsedProductControls.every(item =>
//                     typeof item === 'object' && item !== null &&
//                     'productTitle' in item && typeof item.productTitle === 'string' &&
//                     'productIcon' in item && typeof item.productIcon === 'string' && // Assuming URL string
//                     'productDescription' in item && typeof item.productDescription === 'string'
//                 )) {
//                     throw new Error('Invalid format for productControls. Expected an array of objects.');
//                 }
//             }
//         } catch (jsonError) {
//             console.error('POST /api/product error parsing productControls:', jsonError);
//             return NextResponse.json(
//                 { success: false, message: `Invalid JSON format for productControls: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}` },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         let parsedKeyFeatures: IProduct['keyFeatures'] = [];
//         try {
//             if (keyFeaturesJson && typeof keyFeaturesJson === 'string') {
//                 parsedKeyFeatures = JSON.parse(keyFeaturesJson);
//                 if (!Array.isArray(parsedKeyFeatures) || !parsedKeyFeatures.every(item =>
//                     typeof item === 'object' && item !== null &&
//                     'featureTitle' in item && typeof item.featureTitle === 'string' &&
//                     'featureIcon' in item && typeof item.featureIcon === 'string' && // Assuming URL string
//                     'featureDescription' in item && typeof item.featureDescription === 'string'
//                 )) {
//                     throw new Error('Invalid format for keyFeatures. Expected an array of objects.');
//                 }
//             }
//         } catch (jsonError) {
//             console.error('POST /api/product error parsing keyFeatures:', jsonError);
//             return NextResponse.json(
//                 { success: false, message: `Invalid JSON format for keyFeatures: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}` },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         let parsedScreenshot: IProduct['screenshot'] = [];
//         try {
//             if (screenshotJson && typeof screenshotJson === 'string') {
//                 parsedScreenshot = JSON.parse(screenshotJson);
//                 if (!Array.isArray(parsedScreenshot) || !parsedScreenshot.every(item =>
//                     typeof item === 'object' && item !== null &&
//                     'screenshotImage' in item && typeof item.screenshotImage === 'string' // Assuming URL string
//                 )) {
//                     throw new Error('Invalid format for screenshot. Expected an array of objects.');
//                 }
//             }
//         } catch (jsonError) {
//             console.error('POST /api/product error parsing screenshot:', jsonError);
//             return NextResponse.json(
//                 { success: false, message: `Invalid JSON format for screenshot: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}` },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         // 4. Create the new Product document
//         const newProduct = await Product.create({
//             heading: heading as string,
//             title: title as string,
//             subHeading: subHeading as string,
//             description: description as string,
//             videoFile: videoFileUrl,
//             franchiseData: franchiseData as string,
//             efficiency: efficiency as string,
//             rating: rating as string,
//             productControls: parsedProductControls,
//             keyFeatures: parsedKeyFeatures,
//             screenshot: parsedScreenshot,
//         });

//         return NextResponse.json(
//             { success: true, data: newProduct, message: 'Product created successfully.' },
//             { status: 201, headers: corsHeaders }
//         );

//     } catch (error) {
//         console.error('POST /api/product error:', error);
//         const message = error instanceof Error ? error.message : 'Internal Server Error';
//         return NextResponse.json(
//             { success: false, message },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }








import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Product, { IProduct } from '@/models/Product';
import imagekit from '@/utils/imagekit'; // Ensure ImageKit utility is imported
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for uploads

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};



// Interface for Product Core (without Mongoose Document specific fields)
export interface IProductCore {
    _id?: string;
    heading: string; // Assuming 'title' from frontend maps to 'titleA' on backend
    title: string; // Assuming 'subHeading' from frontend maps to 'titleB' on backend
    subHeading: string;
    description: string;
    videoFile: string;
    franchiseData: string;
    efficiency: string;
    rating: string;
    productControls: {
        productTitle: string;
        productIcon: string; // This will now be the ImageKit URL
        productDescription: string;
    }[];
    keyFeatures: {
        featureTitle: string;
        featureIcon: string; // This will now be the ImageKit URL
        featureDescription: string;
    }[];
    screenshot: {
        screenshotImage: string; // This will now be the ImageKit URL
    }[];
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}


// Helper function to process array fields from FormData
async function processArrayField<T extends { [key: string]:string | string[] }>(
    formData: FormData,
    prefix: string, // e.g., 'productControls', 'keyFeatures', 'screenshot'
    fileFieldName: string | null, // e.g., 'productIcon', 'featureIcon', 'file'. Use null if no file field.
    urlExistingFieldName: string | null, // e.g., 'productIconUrl_existing', 'featureIconUrl_existing', 'imageUrl_existing'. Use null if no existing URL field.
    targetFolder: string, // ImageKit folder
    schemaKeys: string[] // List of text keys in the item (e.g., ['productTitle', 'productDescription'])
): Promise<T[]> {
    const items: T[] = [];
    let index = 0;

    console.log(`\n--- Starting processing for array field: ${prefix} ---`);

    while (true) {
        let foundDataForCurrentIndex = false;
        const potentialFileKey = fileFieldName ? `${prefix}[${index}].${fileFieldName}` : null;
        const potentialUrlExistingKey = urlExistingFieldName ? `${prefix}[${index}].${urlExistingFieldName}` : null;
        const potentialSchemaKey = schemaKeys.length > 0 ? `${prefix}[${index}].${schemaKeys[0]}` : null;

        // Check for the presence of any expected field for the current item index
        if (potentialSchemaKey && formData.has(potentialSchemaKey)) {
            foundDataForCurrentIndex = true;
            console.log(`  [${prefix}][${index}] Found schema key: ${potentialSchemaKey}`);
        }

        if (!foundDataForCurrentIndex && potentialFileKey && formData.has(potentialFileKey)) {
            foundDataForCurrentIndex = true;
            console.log(`  [${prefix}][${index}] Found file key: ${potentialFileKey}`);
        }

        if (!foundDataForCurrentIndex && potentialUrlExistingKey && formData.has(potentialUrlExistingKey)) {
            foundDataForCurrentIndex = true;
            console.log(`  [${prefix}][${index}] Found existing URL key: ${potentialUrlExistingKey}`);
        }

        if (!foundDataForCurrentIndex) {
            console.log(`  [${prefix}] No data found for index ${index}. Breaking loop.`);
            break; // Exit loop if no relevant data found for current index
        }
        
        console.log(`  [${prefix}] Processing item at index ${index}`);

        const item: { [key: string]: string } = {};

        // Extract text fields
        for (const key of schemaKeys) {
            const value = formData.get(`${prefix}[${index}].${key}`);
            item[key] = value instanceof File ? value.name : (value?.toString() || '');
            console.log(`    [${prefix}][${index}] Extracted text field ${key}: '${item[key]}'`);
        }

        const file = potentialFileKey ? formData.get(potentialFileKey) : null;
        const existingUrl = potentialUrlExistingKey ? formData.get(potentialUrlExistingKey) : null;
        let finalUrl: string = '';

        console.log(`    [${prefix}][${index}] File object retrieved from FormData.get('${potentialFileKey}'):`, file, `(Typeof: ${typeof file}, Is File instance: ${file instanceof File}, Size: ${file instanceof File ? file.size : 'N/A'})`);
        console.log(`    [${prefix}][${index}] Existing URL string retrieved from FormData.get('${potentialUrlExistingKey}'):`, existingUrl, `(Typeof: ${typeof existingUrl})`);

        // Check if 'file' is actually a File object and has content
        if (file instanceof File && file.size > 0) {
            console.log(`    [${prefix}][${index}] Detected new file for upload: ${file.name}`);
            try {
                const buffer = Buffer.from(await file.arrayBuffer());
                const uploadResponse = await imagekit.upload({
                    file: buffer,
                    fileName: `${uuidv4()}-${file.name}`,
                    folder: targetFolder,
                });
                if (uploadResponse.url) {
                    finalUrl = uploadResponse.url;
                    console.log(`    [${prefix}][${index}] ImageKit upload successful. Final URL: ${finalUrl}`);
                } else {
                    console.error(`    [${prefix}][${index}] ImageKit upload succeeded but returned no URL for ${file.name}. UploadResponse:`, uploadResponse);
                    finalUrl = ''; // Ensure it's an empty string if URL is missing
                }
            } catch (uploadError: unknown) { // Catch any type of error from ImageKit
                console.error(`    [${prefix}][${index}] ImageKit upload failed for ${file.name}:`, uploadError);
                // Log detailed error if available from ImageKit SDK
                if (Array.isArray(uploadError)) {
                    uploadError.forEach(err => {
                        if (typeof err === 'string') {
                            console.error(`      Error Message: ${err}`);
                        }
                    });
                } else {
                    console.error(`Error Message: ${uploadError}`);
                }
                // If upload fails, finalUrl remains empty string, will be caught by hasContent check
                finalUrl = '';
            }
        } else if (typeof existingUrl === 'string' && existingUrl.trim() !== '') {
            console.log(`    [${prefix}][${index}] Using existing URL: ${existingUrl}`);
            finalUrl = existingUrl.trim();
        } else {
            console.log(`    [${prefix}][${index}] No new file or valid existing URL. Final URL will be empty.`);
            finalUrl = ''; // Ensure finalUrl is always a string
        }

        // Assign the final URL to the designated property name for the Mongoose schema
        if (prefix === 'productControls') {
            item['productIcon'] = finalUrl;
        } else if (prefix === 'keyFeatures') {
            item['featureIcon'] = finalUrl;
        } else if (prefix === 'screenshot') {
            item['screenshotImage'] = finalUrl;
        }
        console.log(`    [${prefix}][${index}] Item object after URL assignment:`, item);
        console.log(`    [${prefix}][${index}] Final URL for schema field: '${finalUrl}'`);


        // Refined hasContent logic:
        let currentItemHasContent = false;
        if (prefix === 'screenshot') {
            // For screenshots, content is defined by the presence of a non-empty screenshotImage URL
            currentItemHasContent = !!item['screenshotImage']; // Check if screenshotImage is a truthy string
            console.log(`    [${prefix}][${index}] Screenshot specific content check: item['screenshotImage'] is '${item['screenshotImage']}', currentItemHasContent: ${currentItemHasContent}`);
        } else {
            // For other arrays with text fields, check if any value (including the icon URL) is non-empty
            currentItemHasContent = Object.values(item).some(val => val !== '' && val !== null && val !== undefined);
            console.log(`    [${prefix}][${index}] Generic content check: ${currentItemHasContent}`);
        }
        
        console.log(`    [${prefix}][${index}] Does item have content? ${currentItemHasContent}`);
        if (currentItemHasContent) {
            items.push(item as T);
            console.log(`    [${prefix}][${index}] Item pushed to array. Current array length: ${items.length}`);
        } else {
            console.log(`    [${prefix}][${index}] Item not pushed due to no content.`);
        }

        index++;
    }
    console.log(`--- Finished processing array field: ${prefix}. Final items count: ${items.length} ---\n`);
    return items;
}


export async function GET() {
    await connectToDatabase();

    try {
        const products = await Product.find({ isDeleted: { $ne: true } }).lean();

        return NextResponse.json(
            { success: true, data: products, message: 'Products fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/product error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const formData = await req.formData();
        console.log('Received formData for /api/product POST (main handler):', formData); // Log the incoming formData

        const heading = formData.get('heading');
        const title = formData.get('title');
        const subHeading = formData.get('subHeading');
        const description = formData.get('description');
        const franchiseData = formData.get('franchiseData');
        const efficiency = formData.get('efficiency');
        const rating = formData.get('rating');

        // Extracting file field for video (handled similar to before)
        const videoFile = formData.get('videoFile');

        // 1. Input Validation for required string fields
        if (
            typeof title !== 'string' || !title.trim() ||
            typeof heading !== 'string' || !heading.trim() ||
            typeof subHeading !== 'string' || !subHeading.trim() ||
            typeof description !== 'string' || !description.trim() ||
            typeof franchiseData !== 'string' || !franchiseData.trim() ||
            typeof efficiency !== 'string' || !efficiency.trim() ||
            typeof rating !== 'string' || !rating.trim()
        ) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid data for required text fields.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Handle video file/URL upload
        let videoFileUrl = '';
        if (typeof videoFile === 'string' && videoFile.trim()) {
            videoFileUrl = videoFile.trim();
        } else if (videoFile instanceof File && videoFile.size > 0) {
            const buffer = Buffer.from(await videoFile.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${uuidv4()}-${videoFile.name}`,
                folder: '/product-videos',
            });
            if (uploadResponse.url) {
                videoFileUrl = uploadResponse.url;
            } else {
                return NextResponse.json(
                    { success: false, message: 'Failed to upload video file to ImageKit.' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else {
            return NextResponse.json(
                { success: false, message: 'Video file (URL or actual file) is required and must not be empty.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Process productControls, keyFeatures, and screenshots using the helper function
        const parsedProductControls = await processArrayField<IProduct['productControls'][0]>(
            formData,
            'productControls',
            'productIcon', // fileFieldName (as sent from frontend)
            'productIconUrl_existing', // urlExistingFieldName (as sent from frontend)
            '/product-icons',
            ['productTitle', 'productDescription'] // text schema keys
        );

        const parsedKeyFeatures = await processArrayField<IProduct['keyFeatures'][0]>(
            formData,
            'keyFeatures',
            'featureIcon', // fileFieldName
            'featureIconUrl_existing', // urlExistingFieldName
            '/feature-icons',
            ['featureTitle', 'featureDescription'] // text schema keys
        );

        const parsedScreenshot = await processArrayField<IProduct['screenshot'][0]>(
            formData,
            'screenshot',
            'file', // The frontend field name for the file is 'file'
            'imageUrl_existing', // The frontend field name for existing URL is 'imageUrl_existing'
            '/product-screenshots',
            [] // No additional text fields, as 'screenshotImage' is the file URL itself in the model
        );
        
        // Ensure arrays are not empty if required by schema, or provide defaults
        if (parsedProductControls.length === 0) {
             return NextResponse.json(
                { success: false, message: 'At least one Product Control is required.' },
                { status: 400, headers: corsHeaders }
            );
        }
        if (parsedKeyFeatures.length === 0) {
            return NextResponse.json(
                { success: false, message: 'At least one Key Feature is required.' },
                { status: 400, headers: corsHeaders }
            );
        }
        // This is the specific validation that was failing for screenshots
        if (parsedScreenshot.length === 0) {
            return NextResponse.json(
                { success: false, message: 'At least one Screenshot is required.' },
                { status: 400, headers: corsHeaders }
            );
        }


        // 4. Create the new Product document
        const newProduct = await Product.create({
            heading: heading as string,
            title: title as string,
            subHeading: subHeading as string,
            description: description as string,
            videoFile: videoFileUrl,
            franchiseData: franchiseData as string,
            efficiency: efficiency as string,
            rating: rating as string,
            productControls: parsedProductControls,
            keyFeatures: parsedKeyFeatures,
            screenshot: parsedScreenshot,
        });

        return NextResponse.json(
            { success: true, data: newProduct, message: 'Product created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/product error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
