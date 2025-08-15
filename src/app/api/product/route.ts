
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db'; 
import Product, { IProduct } from '@/models/Product'; 
import imagekit from '@/utils/imagekit';
import { v4 as uuidv4 } from 'uuid';


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};



export interface IProductCore {
    _id?: string;
    titleA: string;
    titleB: string;
    heading: string;
    description: string;
    videoFile: string;
    franchiseData: string;
    efficiency: string;
    rating: string;
    productControls: {
        productTitle: string;
        productIcon: string; 
        productDescription: string;
    }[];
    keyFeatures: {
        featureTitle: string;
        featureIcon: string;
        featureDescription: string;
    }[];
    screenshot: {
        screenshotImage: string;
    }[];
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
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
      
        
        const titleA = formData.get('titleA');
        const titleB = formData.get('titleB');
        const heading = formData.get('heading');
        const description = formData.get('description');
        const franchiseData = formData.get('franchiseData');
        const efficiency = formData.get('efficiency');
        const rating = formData.get('rating');

        // Extracting JSON stringified array fields
        const productControlsJson = formData.get('productControls');
        const keyFeaturesJson = formData.get('keyFeatures');
        const screenshotJson = formData.get('screenshot');

        // Extracting file field
        const videoFile = formData.get('videoFile');

        // 1. Input Validation for required string fields
        if (
            typeof titleA !== 'string' || !titleA.trim() ||
            typeof titleB !== 'string' || !titleB.trim() ||
            typeof heading !== 'string' || !heading.trim() ||
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

       let videoFileUrl = '';
        if (typeof videoFile === 'string' && videoFile.trim()) {
            // If it's a non-empty string, assume it's a URL
            videoFileUrl = videoFile.trim();
        } else if (videoFile instanceof File && videoFile.size > 0) {
            // If it's a file and not empty, upload to ImageKit
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
            // Neither a valid URL string nor a valid file was provided
            return NextResponse.json(
                { success: false, message: 'Video file (URL or actual file) is required and must not be empty.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // 3. Parse JSON stringified array fields and validate their structure
        let parsedProductControls: IProduct['productControls'] = [];
        try {
            if (productControlsJson && typeof productControlsJson === 'string') {
                parsedProductControls = JSON.parse(productControlsJson);
                if (!Array.isArray(parsedProductControls) || !parsedProductControls.every(item =>
                    typeof item === 'object' && item !== null &&
                    'productTitle' in item && typeof item.productTitle === 'string' &&
                    'productIcon' in item && typeof item.productIcon === 'string' && // Assuming URL string
                    'productDescription' in item && typeof item.productDescription === 'string'
                )) {
                    throw new Error('Invalid format for productControls. Expected an array of objects.');
                }
            }
        } catch (jsonError) {
            console.error('POST /api/product error parsing productControls:', jsonError);
            return NextResponse.json(
                { success: false, message: `Invalid JSON format for productControls: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}` },
                { status: 400, headers: corsHeaders }
            );
        }

        let parsedKeyFeatures: IProduct['keyFeatures'] = [];
        try {
            if (keyFeaturesJson && typeof keyFeaturesJson === 'string') {
                parsedKeyFeatures = JSON.parse(keyFeaturesJson);
                if (!Array.isArray(parsedKeyFeatures) || !parsedKeyFeatures.every(item =>
                    typeof item === 'object' && item !== null &&
                    'featureTitle' in item && typeof item.featureTitle === 'string' &&
                    'featureIcon' in item && typeof item.featureIcon === 'string' && // Assuming URL string
                    'featureDescription' in item && typeof item.featureDescription === 'string'
                )) {
                    throw new Error('Invalid format for keyFeatures. Expected an array of objects.');
                }
            }
        } catch (jsonError) {
            console.error('POST /api/product error parsing keyFeatures:', jsonError);
            return NextResponse.json(
                { success: false, message: `Invalid JSON format for keyFeatures: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}` },
                { status: 400, headers: corsHeaders }
            );
        }

        let parsedScreenshot: IProduct['screenshot'] = [];
        try {
            if (screenshotJson && typeof screenshotJson === 'string') {
                parsedScreenshot = JSON.parse(screenshotJson);
                if (!Array.isArray(parsedScreenshot) || !parsedScreenshot.every(item =>
                    typeof item === 'object' && item !== null &&
                    'screenshotImage' in item && typeof item.screenshotImage === 'string' // Assuming URL string
                )) {
                    throw new Error('Invalid format for screenshot. Expected an array of objects.');
                }
            }
        } catch (jsonError) {
            console.error('POST /api/product error parsing screenshot:', jsonError);
            return NextResponse.json(
                { success: false, message: `Invalid JSON format for screenshot: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}` },
                { status: 400, headers: corsHeaders }
            );
        }

        // 4. Create the new Product document
        const newProduct = await Product.create({
            titleA: titleA as string,
            titleB: titleB as string,
            heading: heading as string,
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