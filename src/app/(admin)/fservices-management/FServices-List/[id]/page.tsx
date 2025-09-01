// // 'use client';

// // import React, { useEffect, useState } from 'react';
// // import { useParams, useRouter } from 'next/navigation';
// // import axios from 'axios'; 
// // import { PencilIcon } from 'lucide-react';
// // import Link from 'next/link';
// // import { TrashBinIcon } from '@/icons'; // Assuming TrashBinIcon is correctly imported
// // import { IFServices } from '@/models/FServices';

// // // Define the expected structure of the API response for a single fservice
// // interface SingleFServiceApiResponse {
// //     success: boolean;
// //     data?: IFServices; // The actual fservice data is nested under 'data'
// //     message?: string;
// // }

// // const FServiceDetailPage: React.FC = () => {
// //     // useParams returns a string or string[] or undefined. We expect 'id' to be a string.
// //     const params = useParams();
// //     const id = typeof params.id === 'string' ? params.id : undefined;

// //     const router = useRouter();
// //     const [fservice, setFService] = useState<IFServices | null>(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState<string | null>(null);

// //     useEffect(() => {
// //         const fetchFService = async () => {
// //             if (!id) {
// //                 setLoading(false);
// //                 setError('FService ID is missing.');
// //                 return;
// //             }
// //             try {
// //                 // Type the axios response directly to the SingleFServiceApiResponse interface
// //                 const res = await axios.get<SingleFServiceApiResponse>(`/api/fservices/${id}`);
// //                 if (res.data.success && res.data.data) {
// //                     setFService(res.data.data);
// //                 } else {
// //                     setError(res.data.message || 'FService not found.');
// //                 }
// //             } catch (err) {
// //                 console.error('Error fetching fservice details:', err);
// //                 if (axios.isAxiosError(err)) {
// //                     setError(err.response?.data?.message || 'Failed to load fservice details.');
// //                 } else if (err instanceof Error) {
// //                     setError(err.message);
// //                 } else {
// //                     setError('An unexpected error occurred while fetching fservice details.');
// //                 }
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchFService();
// //     }, [id]); // Depend on 'id' to re-fetch if the ID changes

// //     if (loading) {
// //         return (
// //             <div className="container mx-auto px-4 py-8">
// //                 <p className="text-center text-gray-500">Loading fservice details...</p>
// //             </div>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <div className="container mx-auto px-4 py-8">
// //                 <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
// //             </div>
// //         );
// //     }

// //     if (!fservice) {
// //         return (
// //             <div className="container mx-auto px-4 py-8">
// //                 <p className="text-center text-gray-700">FService not found.</p>
// //             </div>
// //         );
// //     }

// //     const handleDelete = async () => {
// //         // As per guidelines, replacing window.confirm with a simpler alert, or you can implement a custom modal here.
// //         if (!confirm('Are you sure you want to delete this fservice?')) {
// //             return;
// //         }

// //         try {
// //             setLoading(true); // Indicate loading while deleting
// //             await axios.delete(`/api/fservices/${fservice._id}`); // Use fservice._id directly
// //             alert('FService deleted successfully!');
// //             router.push('/admin/fservices-management/FServices-List'); // Redirect to fservices list page
// //         } catch (err) {
// //             console.error('Error deleting fservice:', err);
// //             if (axios.isAxiosError(err)) {
// //                 setError(err.response?.data?.message || 'Failed to delete the fservice. Please try again.');
// //             } else if (err instanceof Error) {
// //                 setError(err.message);
// //             } else {
// //                 setError('An unknown error occurred during deletion. Please try again.');
// //             }
// //         } finally {
// //             setLoading(false); // Stop loading regardless of success or failure
// //         }
// //     };

// //     return (
// //         <div className="container mx-auto px-4 py-8">
// //             <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
// //                 <div className="flex justify-between items-start mb-6">
// //                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{fservice.title}</h1>
// //                     <div className="flex space-x-3">
// //                         <Link
// //                             href={`/fservices-management/Add-FService?page=edit&id=${fservice._id as string}`}
// //                             className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
// //                             title="Edit FService"
// //                         >
// //                             <PencilIcon size={16} />
// //                         </Link>
// //                         <button
// //                             onClick={handleDelete}
// //                             className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
// //                             title="Delete FService"
// //                         >
// //                             <TrashBinIcon />
// //                         </button>
// //                     </div>
// //                 </div>

// //                 {/* Main FService Details */}
// //                 <div className="space-y-6 text-gray-700 dark:text-gray-300">
// //                     <p><strong>Description:</strong> {fservice.description}</p>
// //                     <p><strong>Video Link:</strong> {fservice.videoLink ? <a href={fservice.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{fservice.videoLink}</a> : 'N/A'}</p>

// //                     <p><strong>Created At:</strong> {fservice.createdAt ? new Date(fservice.createdAt).toLocaleString() : 'N/A'}</p>
// //                     <p><strong>Last Updated:</strong> {fservice.updatedAt ? new Date(fservice.updatedAt).toLocaleString() : 'N/A'}</p>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default FServiceDetailPage;







// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios'; 
// import { PencilIcon } from 'lucide-react';
// import Link from 'next/link';
// import { TrashBinIcon } from '@/icons';
// import { IFServices } from '@/models/FServices';
// import NextImage from 'next/image';

// // Define the expected structure of the API response for a single fservice
// interface SingleFServiceApiResponse {
//     success: boolean;
//     data?: IFServices;
//     message?: string;
// }

// // Interface for YouTube video data
// interface YouTubeVideo {
//     id: string;
//     title: string;
//     thumbnail: string;
//     url: string;
// }

// const FServiceDetailPage: React.FC = () => {
//     const params = useParams();
//     const id = typeof params.id === 'string' ? params.id : undefined;
//     const router = useRouter();
//     const [fservice, setFService] = useState<IFServices | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [videos, setVideos] = useState<YouTubeVideo[]>([]);

//     useEffect(() => {
//         const fetchFService = async () => {
//             if (!id) {
//                 setLoading(false);
//                 setError('FService ID is missing.');
//                 return;
//             }
//             try {
//                 const res = await axios.get<SingleFServiceApiResponse>(`/api/fservices/${id}`);
//                 if (res.data.success && res.data.data) {
//                     setFService(res.data.data);
//                     // Parse video links if they exist
//                     if (res.data.data.videoLink) {
//                         parseVideoLinks(res.data.data.videoLink);
//                     }
//                 } else {
//                     setError(res.data.message || 'FService not found.');
//                 }
//             } catch (err) {
//                 console.error('Error fetching fservice details:', err);
//                 if (axios.isAxiosError(err)) {
//                     setError(err.response?.data?.message || 'Failed to load fservice details.');
//                 } else if (err instanceof Error) {
//                     setError(err.message);
//                 } else {
//                     setError('An unexpected error occurred while fetching fservice details.');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFService();
//     }, [id]);

//     // Function to parse YouTube video links and extract thumbnails
//     const parseVideoLinks = (videoLinks: string | string[]) => {
//         try {
//             const linksArray = Array.isArray(videoLinks) ? videoLinks : [videoLinks];
//             const youtubeVideos: YouTubeVideo[] = [];

//             linksArray.forEach((link, index) => {
//                 if (link && typeof link === 'string') {
//                     // Extract YouTube video ID
//                     const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
//                     const match = link.match(youtubeRegex);
                    
//                     if (match && match[1]) {
//                         const videoId = match[1];
//                         youtubeVideos.push({
//                             id: videoId,
//                             title: `Video ${index + 1}`,
//                             thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
//                             url: link
//                         });
//                     } else {
//                         // For non-YouTube links or invalid URLs
//                         youtubeVideos.push({
//                             id: `link-${index}`,
//                             title: `Video ${index + 1}`,
//                             thumbnail: '/placeholder-thumbnail.jpg', // Add a placeholder image
//                             url: link
//                         });
//                     }
//                 }
//             });

//             setVideos(youtubeVideos);
//         } catch (error) {
//             console.error('Error parsing video links:', error);
//         }
//     };

//     const handleDelete = async () => {
//         if (!confirm('Are you sure you want to delete this fservice?')) {
//             return;
//         }

//         try {
//             setLoading(true);
//             await axios.delete(`/api/fservices/${fservice?._id}`);
//             alert('FService deleted successfully!');
//             router.push('/admin/fservices-management/FServices-List');
//         } catch (err) {
//             console.error('Error deleting fservice:', err);
//             if (axios.isAxiosError(err)) {
//                 setError(err.response?.data?.message || 'Failed to delete the fservice. Please try again.');
//             } else if (err instanceof Error) {
//                 setError(err.message);
//             } else {
//                 setError('An unknown error occurred during deletion. Please try again.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleVideoClick = (url: string) => {
//         window.open(url, '_blank', 'noopener,noreferrer');
//     };

//     if (loading) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <p className="text-center text-gray-500">Loading fservice details...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
//             </div>
//         );
//     }

//     if (!fservice) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <p className="text-center text-gray-700">FService not found.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
//                 <div className="flex justify-between items-start mb-6">
//                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{fservice.title}</h1>
//                     <div className="flex space-x-3">
//                         <Link
//                             href={`/fservices-management/Add-FService?page=edit&id=${fservice._id as string}`}
//                             className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
//                             title="Edit FService"
//                         >
//                             <PencilIcon size={16} />
//                         </Link>
//                         <button
//                             onClick={handleDelete}
//                             className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
//                             title="Delete FService"
//                         >
//                             <TrashBinIcon />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Main FService Details */}
//                 <div className="space-y-6 text-gray-700 dark:text-gray-300">
//                     <div>
//                         <strong className="block mb-2">Description:</strong>
//                         <p>{fservice.description}</p>
//                     </div>
//                     {fservice.videoLink.length > 0 && (
//                         <div>
//                             <strong className="block mb-4">Videos:</strong>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                  {fservice.videoLink.map((video) => (
//                                     <div
//                                         key={video.id}
//                                         className="cursor-pointer group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
//                                         onClick={() => handleVideoClick(video.url)}
//                                         title="Click to watch on YouTube"
//                                     >
//                                         <div className="relative aspect-video">
//                                             <NextImage
//                                                 src={video.videoLink}
//                                                 alt={video.title}
//                                                 fill
//                                                 className="object-cover group-hover:scale-105 transition-transform duration-300"
//                                                 onError={(e) => {
//                                                     // Fallback for broken images
//                                                     e.currentTarget.src = '/placeholder-thumbnail.jpg';
//                                                 }}
//                                             />
//                                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
//                                                 <div className="w-16 h-16 bg-red-600 bg-opacity-80 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
//                                                     <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
//                                                         <path d="M8 5v14l11-7z" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                         </div>
                                        
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )} 

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                         <div>
//                             <strong>Created At:</strong>{' '}
//                             {fservice.createdAt ? new Date(fservice.createdAt).toLocaleString() : 'N/A'}
//                         </div>
//                         <div>
//                             <strong>Last Updated:</strong>{' '}
//                             {fservice.updatedAt ? new Date(fservice.updatedAt).toLocaleString() : 'N/A'}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FServiceDetailPage;




'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios'; 
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';
import { IFServices } from '@/models/FServices';

interface SingleFServiceApiResponse {
    success: boolean;
    data?: IFServices;
    message?: string;
}

const FServiceDetailPage: React.FC = () => {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : undefined;
    const router = useRouter();
    const [fservice, setFService] = useState<IFServices | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [youtubeThumbnail, setYoutubeThumbnail] = useState<string | null>(null);

    useEffect(() => {
        const fetchFService = async () => {
            if (!id) {
                setLoading(false);
                setError('FService ID is missing.');
                return;
            }
            try {
                const res = await axios.get<SingleFServiceApiResponse>(`/api/fservices/${id}`);
                if (res.data.success && res.data.data) {
                    setFService(res.data.data);
                    // Extract YouTube thumbnail if videoLink exists
                    if (res.data.data.videoLink) {
                        extractYoutubeThumbnail(res.data.data.videoLink);
                    }
                } else {
                    setError(res.data.message || 'FService not found.');
                }
            } catch (err) {
                console.error('Error fetching fservice details:', err);
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || 'Failed to load fservice details.');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred while fetching fservice details.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFService();
    }, [id]);

    // Function to extract YouTube thumbnail from video link
    const extractYoutubeThumbnail = (videoLink: string) => {
        try {
            if (videoLink && typeof videoLink === 'string') {
                // Extract YouTube video ID
                const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
                const match = videoLink.match(youtubeRegex);
                
                if (match && match[1]) {
                    const videoId = match[1];
                    setYoutubeThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
                }
            }
        } catch (error) {
            console.error('Error extracting YouTube thumbnail:', error);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this fservice?')) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`/api/fservices/${fservice?._id}`);
            alert('FService deleted successfully!');
            router.push('/admin/fservices-management/FServices-List');
        } catch (err) {
            console.error('Error deleting fservice:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete the fservice. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during deletion. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = () => {
        if (fservice?.videoLink) {
            window.open(fservice.videoLink, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-500">Loading fservice details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
            </div>
        );
    }

    if (!fservice) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-700">FService not found.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{fservice.title}</h1>
                    <div className="flex space-x-3">
                        <Link
                            href={`/fservices-management/Add-FServices?page=edit&id=${fservice._id as string}`}
                            className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Edit FService"
                        >
                            <PencilIcon size={16} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Delete FService"
                        >
                            <TrashBinIcon />
                        </button>
                    </div>
                </div>

                {/* Main FService Details */}
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div>
                        <strong className="block mb-2">Description:</strong>
                        <p>{fservice.description}</p>
                    </div>

                    {fservice.videoLink && (
                        <div>
                            <strong className="block mb-4">Video:</strong>
                            <div 
                                className="cursor-pointer group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow max-w-md"
                                onClick={handleVideoClick}
                                title="Click to watch on YouTube"
                            >
                                {youtubeThumbnail ? (
                                    <div className="relative aspect-video">
                                        <img
                                            src={youtubeThumbnail}
                                            alt={fservice.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                                            <div className="w-16 h-16 bg-red-600 bg-opacity-80 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                                        <div className="text-center p-4">
                                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Click to watch video</p>
                                        </div>
                                    </div>
                                )}
                                <div className="p-3 bg-white dark:bg-gray-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {fservice.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {fservice.videoLink}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Created At:</strong>{' '}
                            {fservice.createdAt ? new Date(fservice.createdAt).toLocaleString() : 'N/A'}
                        </div>
                        <div>
                            <strong>Last Updated:</strong>{' '}
                            {fservice.updatedAt ? new Date(fservice.updatedAt).toLocaleString() : 'N/A'}
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default FServiceDetailPage;