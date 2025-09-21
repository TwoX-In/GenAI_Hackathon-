import React, { useState, useEffect } from "react";
import { Text } from "@/components/retroui/Text";
import { Request } from "@/request/request";
import { YoutubeUrlChecker } from "./YoutubeUrlChecker";
import { Play, Download, Share, Clock, Zap } from "lucide-react";

export function ProductVideos({ productId, productTitle, videos, editedVideo, reelVideo }) {
    const [videoData, setVideoData] = useState({
        longerVideo: null,
        shorterVideo: null,
        loading: true
    });

    useEffect(() => {
        const processVideos = () => {
            const processedVideos = [];
            
            // Add edited video (longer video)
            if (editedVideo) {
                processedVideos.push({
                    type: 'story',
                    data: editedVideo,
                    title: 'Story Telling Video',
                    description: 'Perfect for YouTube and detailed storytelling',
                    icon: <Clock className="w-5 h-5" />,
                    bgColor: 'bg-blue-300',
                    platform: 'YouTube'
                });
            }

            // Add reel video (shorter video)
            if (reelVideo) {
                processedVideos.push({
                    type: 'reel',
                    data: reelVideo,
                    title: 'Reel Video',
                    description: 'Optimized for TikTok and Instagram Reels',
                    icon: <Zap className="w-5 h-5" />,
                    bgColor: 'bg-purple-300',
                    platform: 'TikTok / Instagram'
                });
            }

            // Add any additional videos from the videos array
            if (videos && videos.length > 0) {
                videos.forEach((video, index) => {
                    // Skip if this video is already included as edited or reel video
                    if (video !== editedVideo && video !== reelVideo) {
                        processedVideos.push({
                            type: 'additional',
                            data: video,
                            title: `Additional Video ${index + 1}`,
                            description: 'General purpose video content',
                            icon: <Play className="w-5 h-5" />,
                            bgColor: 'bg-green-300',
                            platform: 'Multi-platform'
                        });
                    }
                });
            }

            setVideoData({
                processedVideos,
                loading: false
            });
        };

        processVideos();
    }, [videos, editedVideo, reelVideo]);

    const VideoCard = ({ video, index }) => {
        const downloadVideo = () => {
            const link = document.createElement('a');
            link.href = `data:video/mp4;base64,${video.data}`;
            link.download = `${video.title.toLowerCase().replace(/\s+/g, '_')}_${productId}.mp4`;
            link.click();
        };

        const shareVideo = () => {
            if (navigator.share) {
                navigator.share({
                    title: `${video.title} - ${productTitle}`,
                    text: `Check out this ${video.title.toLowerCase()} for ${productTitle}!`,
                });
            }
        };

        return (
            <div className={`${video.bgColor} border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 transform hover:-rotate-1 transition-all duration-300`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-black text-white p-2 border-2 border-black">
                            {video.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-wider">
                                {video.title}
                            </h3>
                            <p className="text-sm font-bold opacity-80">
                                {video.platform}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Video Player */}
                <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4 overflow-hidden">
                    <div className="aspect-video bg-gray-200 border-b-4 border-black relative flex items-center justify-center">
                        <video
                            className="w-full h-full object-contain"
                            controls
                            preload="metadata"
                        >
                            <source src={`data:video/mp4;base64,${video.data}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-black text-white p-3 border-2 border-black mb-4">
                    <p className="font-bold text-sm">{video.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={downloadVideo}
                        className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] font-bold text-black px-4 py-2 flex items-center gap-2 transition-all duration-150"
                    >
                        <Download className="w-4 h-4" />
                        DOWNLOAD
                    </button>
                    
                    <button
                        onClick={shareVideo}
                        className="bg-yellow-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] font-bold text-black px-4 py-2 flex items-center gap-2 transition-all duration-150"
                    >
                        <Share className="w-4 h-4" />
                        SHARE
                    </button>
                </div>
            </div>
        );
    };

    if (videoData.loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 transform rotate-2">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
                        <p className="text-2xl font-black uppercase tracking-wider">
                            LOADING VIDEOS...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,219,51,1)] transform rotate-1 inline-block">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider">
                        GENERATED VIDEOS
                    </h2>
                    <p className="text-lg font-bold mt-2">Ready for different platforms</p>
                </div>
            </div>

            {/* YouTube Status Checker */}
            <YoutubeUrlChecker productId={productId} productTitle={productTitle} />

            {/* Videos Grid */}
            {videoData.processedVideos && videoData.processedVideos.length > 0 ? (
                <div className="grid gap-8 lg:grid-cols-1">
                    {videoData.processedVideos.map((video, index) => (
                        <VideoCard key={index} video={video} index={index} />
                    ))}
                </div>
            ) : (
                <div className="bg-red-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 text-black bg-white border-4 border-black p-2">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    </div>
                    <p className="text-black font-bold text-lg">NO VIDEOS AVAILABLE!</p>
                    <p className="text-black font-medium mt-1">Videos will appear here once generated</p>
                </div>
            )}

            {/* Platform Usage Tips */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mt-8">
                <div className="flex items-center mb-4">
                    <div className="bg-yellow-300 text-black p-2 mr-4 border-2 border-black">
                        <Play className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-wider">PLATFORM GUIDE</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-100 border-2 border-black p-4">
                        <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            STORY TELLING VIDEO
                        </h4>
                        <ul className="font-bold text-sm space-y-1">
                            <li>• Perfect for YouTube content</li>
                            <li>• Detailed product storytelling</li>
                            <li>• Educational and engaging</li>
                            <li>• Longer format for deep dives</li>
                        </ul>
                    </div>
                    
                    <div className="bg-purple-100 border-2 border-black p-4">
                        <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            REEL VIDEO
                        </h4>
                        <ul className="font-bold text-sm space-y-1">
                            <li>• Optimized for TikTok & Instagram</li>
                            <li>• Quick, engaging content</li>
                            <li>• Perfect for social media</li>
                            <li>• Short format for maximum impact</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}