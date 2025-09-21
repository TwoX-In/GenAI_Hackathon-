import React, { useState, useEffect } from "react";
import { Request } from "@/request/request";

export function SocialMediaPreview({ 
    uid, 
    story, 
    outputImages, 
    videos,
    productMedium,
    productColors,
    productOrigin,
    predictedArtist
}) {
    const [youtubeMetadata, setYoutubeMetadata] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Generate YouTube metadata based on the backend logic
    useEffect(() => {
        if (uid && story && productMedium && predictedArtist) {
            const keywords = [
                productMedium?.medium || "Unknown",
                productColors?.colors || "Unknown", 
                productOrigin?.origin || "Unknown",
                predictedArtist?.predicted_artist || "Unknown"
            ];
            
            const metadata = {
                title: `${productMedium?.medium || "Artisan Craft"} by ${predictedArtist?.predicted_artist || "Unknown Artist"}`,
                description: story?.story || "Beautiful artisan craft showcasing traditional techniques and cultural heritage.",
                keywords: keywords.join(", "),
                category: 22, // People & Blogs
                privacy_status: "public"
            };
            
            setYoutubeMetadata(metadata);
        }
    }, [uid, story, productMedium, productColors, productOrigin, predictedArtist]);

    const handleImageSelect = (index) => {
        setSelectedImageIndex(index);
    };

    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="space-y-8">
            {/* Photo Posts Preview Section */}
            <div>
                <div className="mb-6">
                    <div className="bg-pink-300 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1">
                        <h2 className="text-2xl font-black text-black uppercase flex items-center gap-2">
                            <span className="text-2xl">📸</span>
                            Photo Post Previews
                        </h2>
                        <p className="text-black font-bold mt-1">Ready-to-share social media content!</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Image Selector */}
                    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4">
                        <h3 className="text-lg font-black text-black uppercase mb-4 bg-yellow-300 p-2 border-2 border-black inline-block">
                            📷 Select Image
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {outputImages && outputImages.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleImageSelect(index)}
                                    className={`cursor-pointer border-4 transition-all duration-200 ${
                                        selectedImageIndex === index 
                                            ? 'border-green-500 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]' 
                                            : 'border-black hover:border-blue-500'
                                    }`}
                                >
                                    <img
                                        src={`data:image/jpeg;base64,${img.image}`}
                                        alt={`Output ${index + 1}`}
                                        className="w-full h-24 object-cover"
                                    />
                                    <div className="p-2 bg-gray-100 text-center">
                                        <span className="text-xs font-bold">Image {index + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Media Post Preview */}
                    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4">
                        <h3 className="text-lg font-black text-black uppercase mb-4 bg-blue-300 p-2 border-2 border-black inline-block">
                            📱 Post Preview
                        </h3>
                        
                        {/* Mock Social Media Post */}
                        <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white max-w-sm mx-auto">
                            {/* Post Header */}
                            <div className="flex items-center p-3 border-b border-gray-200">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">A</span>
                                </div>
                                <div className="ml-3">
                                    <p className="font-semibold text-sm">artisan_assistant</p>
                                    <p className="text-xs text-gray-500">Just now</p>
                                </div>
                            </div>
                            
                            {/* Post Image */}
                            {outputImages && outputImages[selectedImageIndex] && (
                                <div className="aspect-square">
                                    <img
                                        src={`data:image/jpeg;base64,${outputImages[selectedImageIndex].image}`}
                                        alt="Post preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            
                            {/* Post Actions */}
                            <div className="p-3">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-xl">❤️</span>
                                    <span className="text-xl">💬</span>
                                    <span className="text-xl">📤</span>
                                </div>
                                
                                <p className="text-sm">
                                    <span className="font-semibold">artisan_assistant</span>{" "}
                                    {truncateText(story?.story, 100)}
                                </p>
                                
                                <p className="text-xs text-gray-500 mt-2">
                                    #{productMedium?.medium?.replace(/\s+/g, '').toLowerCase()} 
                                    #{productOrigin?.origin?.replace(/\s+/g, '').toLowerCase()}
                                    #artisan #handmade #traditional
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* YouTube Video Preview Section */}
            {youtubeMetadata && (
                <div>
                    <div className="mb-6">
                        <div className="bg-red-300 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
                            <h2 className="text-2xl font-black text-black uppercase flex items-center gap-2">
                                <span className="text-2xl">🎬</span>
                                YouTube Video Preview
                            </h2>
                            <p className="text-black font-bold mt-1">Optimized for maximum reach!</p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Video Preview */}
                        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4">
                            <h3 className="text-lg font-black text-black uppercase mb-4 bg-red-300 p-2 border-2 border-black inline-block">
                                🎥 Video Preview
                            </h3>
                            
                            {videos && videos.length > 0 ? (
                                <div className="border-4 border-black bg-black">
                                    <video
                                        className="w-full aspect-video"
                                        controls
                                        preload="metadata"
                                    >
                                        <source src={`data:video/mp4;base64,${videos[0]}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-200 border-4 border-black flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-4xl mb-2 block">🎬</span>
                                        <p className="font-bold text-gray-600">No video available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* YouTube Metadata Preview */}
                        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4">
                            <h3 className="text-lg font-black text-black uppercase mb-4 bg-yellow-300 p-2 border-2 border-black inline-block">
                                📋 Video Metadata
                            </h3>
                            
                            <div className="space-y-4">
                                {/* Title */}
                                <div className="border-2 border-black p-3 bg-gray-50">
                                    <label className="block text-xs font-black text-gray-600 uppercase mb-1">Title</label>
                                    <p className="font-bold text-black">{youtubeMetadata.title}</p>
                                </div>

                                {/* Description */}
                                <div className="border-2 border-black p-3 bg-gray-50">
                                    <label className="block text-xs font-black text-gray-600 uppercase mb-1">Description</label>
                                    <p className="text-sm text-black leading-relaxed">
                                        {truncateText(youtubeMetadata.description, 150)}
                                    </p>
                                </div>

                                {/* Keywords */}
                                <div className="border-2 border-black p-3 bg-gray-50">
                                    <label className="block text-xs font-black text-gray-600 uppercase mb-1">Keywords</label>
                                    <div className="flex flex-wrap gap-1">
                                        {youtubeMetadata.keywords.split(", ").map((keyword, index) => (
                                            <span 
                                                key={index}
                                                className="px-2 py-1 bg-blue-200 border border-black text-xs font-bold"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Category & Privacy */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="border-2 border-black p-3 bg-gray-50">
                                        <label className="block text-xs font-black text-gray-600 uppercase mb-1">Category</label>
                                        <p className="text-sm font-bold">People & Blogs</p>
                                    </div>
                                    <div className="border-2 border-black p-3 bg-gray-50">
                                        <label className="block text-xs font-black text-gray-600 uppercase mb-1">Privacy</label>
                                        <p className="text-sm font-bold text-green-600">Public</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
                <button className="px-6 py-3 bg-green-400 border-4 border-black font-black text-black uppercase hover:bg-green-500 active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-100">
                    📸 Generate More Posts
                </button>
                <button className="px-6 py-3 bg-purple-400 border-4 border-black font-black text-black uppercase hover:bg-purple-500 active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-100">
                    🎬 Edit Video Metadata
                </button>
            </div>
        </div>
    );
}