import React, { useState, useEffect } from "react";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { FacebookIcon } from "./icons/fb";
import { TwitterIcon } from "./icons/twitter";
import { WhatsAppIcon } from "./icons/whatsapp";
import { YouTubeIcon } from "./icons/youtube";
import { TikTokIcon } from "./icons/tiktok";
import { InstagramIcon } from "./icons/instagram";
import { Request } from "@/request/request";

export function SocialMediaGrid({ uid }) {
    const [youtubeStatus, setYoutubeStatus] = useState({ uploaded: false, url: null, loading: true });
    const [isUploading, setIsUploading] = useState(false);
    
    useEffect(() => {
        if (uid) {
            checkYoutubeStatus();
        }
    }, [uid]);

    const checkYoutubeStatus = async () => {
        try {
            const response = await Request.get(`/social_media/youtube_status/${uid}`);
            setYoutubeStatus({ 
                uploaded: response.uploaded, 
                url: response.url, 
                loading: false 
            });
        } catch (error) {
            console.error("Error checking YouTube status:", error);
            setYoutubeStatus({ uploaded: false, url: null, loading: false });
        }
    };

    const handleYoutubeUpload = async () => {
        if (isUploading || youtubeStatus.uploaded) return;

        setIsUploading(true);
        try {
            const response = await Request.postByUrl("/social_media/upload_video?uid=" + uid);
            if (response && typeof response === 'string' && response.includes('youtube.com')) {
                setYoutubeStatus({ uploaded: true, url: response, loading: false });
            }
        } catch (error) {
            console.error("Error uploading to YouTube:", error);
            alert("Failed to upload to YouTube. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const getYoutubeButtonText = () => {
        if (youtubeStatus.loading) return "Checking...";
        if (isUploading) return "Uploading...";
        if (youtubeStatus.uploaded) return "View on YouTube";
        return "Upload Video";
    };

    const handleYoutubeClick = () => {
        if (youtubeStatus.uploaded && youtubeStatus.url) {
            window.open(youtubeStatus.url, '_blank');
        } else if (!isUploading && !youtubeStatus.loading) {
            handleYoutubeUpload();
        }
    };

    // YouTube Card Component
    const YouTubeCard = () => (
        <Card className={`shadow-none hover:shadow-lg transition duration-300 ${
            youtubeStatus.uploaded ? 'bg-green-200 border-4 border-green-600' : 'bg-[#FF1744]'
        }`}>
            <Card.Content className="pb-0 relative">
                <YouTubeIcon className="w-full h-full" />
                {youtubeStatus.uploaded && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
                {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </Card.Content>
            <Card.Header className="pb-0">
                <Card.Title className={youtubeStatus.uploaded ? 'text-green-800' : ''}>
                    {youtubeStatus.uploaded ? 'YouTube - Live!' : 'YouTube Growth'}
                </Card.Title>
                <Card.Description className={youtubeStatus.uploaded ? 'text-green-700' : ''}>
                    {youtubeStatus.uploaded 
                        ? 'Your video is live on YouTube! Click to view or share with your audience.'
                        : 'Share videos, grow subscribers, and boost your brand visibility on the world\'s biggest video platform.'
                    }
                </Card.Description>
            </Card.Header>
            <Card.Content className="flex justify-between items-center">
                <p className={`text-lg font-semibold ${youtubeStatus.uploaded ? 'text-green-800' : ''}`}>
                    2.7B+ Users
                </p>
                <Button 
                    onClick={handleYoutubeClick}
                    disabled={youtubeStatus.loading || isUploading}
                    className={`${
                        youtubeStatus.uploaded 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : isUploading 
                                ? 'bg-orange-500 text-white cursor-not-allowed'
                                : ''
                    }`}
                >
                    {getYoutubeButtonText()}
                </Button>
            </Card.Content>
            {youtubeStatus.uploaded && youtubeStatus.url && (
                <Card.Content className="pt-0">
                    <div className="flex gap-2">
                        <Button 
                            onClick={() => navigator.clipboard.writeText(youtubeStatus.url)}
                            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm"
                        >
                            📋 Copy URL
                        </Button>
                        <Button 
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Check out my artisan video!',
                                        url: youtubeStatus.url
                                    });
                                }
                            }}
                            className="flex-1 bg-blue-500 text-white hover:bg-blue-600 text-sm"
                        >
                            📤 Share
                        </Button>
                    </div>
                </Card.Content>
            )}
        </Card>
    );

    return (
        <div className="space-y-8">
            {/* Live Platforms Section */}
            {youtubeStatus.uploaded && !youtubeStatus.loading && (
                <div>
                    <div className="mb-6">
                        <div className="bg-green-300 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1">
                            <h2 className="text-2xl font-black text-black uppercase flex items-center gap-2">
                                <span className="text-green-600">🟢</span>
                                Live Platforms
                            </h2>
                            <p className="text-black font-bold mt-1">Your content is already published here!</p>
                        </div>
                    </div>
                    
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                        <YouTubeCard />
                    </div>
                </div>
            )}

            {/* Available Platforms Section */}
            <div>
                <div className="mb-6">
                    <div className="bg-blue-300 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
                        <h2 className="text-2xl font-black text-black uppercase flex items-center gap-2">
                            <span className="text-blue-600">🚀</span>
                            Available Platforms
                        </h2>
                        <p className="text-black font-bold mt-1">Ready to expand your reach!</p>
                    </div>
                </div>
                
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                    {/* Show YouTube in Available section if not uploaded */}
                    {(!youtubeStatus.uploaded || youtubeStatus.loading) && <YouTubeCard />}
                    
                    {/* Facebook */}
                    <Card className="bg-[#2979FF] shadow-none hover:shadow-lg transition duration-300">
                        <Card.Content className="pb-0">
                            <FacebookIcon className="w-full h-full" />
                        </Card.Content>
                        <Card.Header className="pb-0">
                            <Card.Title>Facebook Marketing</Card.Title>
                            <Card.Description>
                                Connect with billions of users worldwide. Share posts, run ads, and grow your audience effectively.
                            </Card.Description>
                        </Card.Header>
                        <Card.Content className="flex justify-between items-center">
                            <p className="text-lg font-semibold">2.9B+ Users</p>
                            <Button>Post on Facebook</Button>
                        </Card.Content>
                    </Card>

                    {/* Twitter */}
                    <Card className="shadow-none hover:shadow-lg transition duration-300">
                        <Card.Content className="pb-0">
                            <TwitterIcon className="w-full h-full" />
                        </Card.Content>
                        <Card.Header className="pb-0">
                            <Card.Title>Twitter (X) Engagement</Card.Title>
                            <Card.Description>
                                Tweet smarter. Build conversations, share updates, and engage with trending topics in real-time.
                            </Card.Description>
                        </Card.Header>
                        <Card.Content className="flex justify-between items-center">
                            <p className="text-lg font-semibold">550M+ Users</p>
                            <Button>Tweet Now</Button>
                        </Card.Content>
                    </Card>

                    {/* WhatsApp */}
                    <Card className="bg-[#00E676] shadow-none hover:shadow-lg transition duration-300">
                        <Card.Content className="pb-0">
                            <WhatsAppIcon className="w-full h-full" />
                        </Card.Content>
                        <Card.Header className="pb-0">
                            <Card.Title>WhatsApp Campaigns</Card.Title>
                            <Card.Description>
                                Reach customers directly via personalized messages, offers, and updates on WhatsApp.
                            </Card.Description>
                        </Card.Header>
                        <Card.Content className="flex justify-between items-center">
                            <p className="text-lg font-semibold">2B+ Users</p>
                            <Button>Send Message</Button>
                        </Card.Content>
                    </Card>

                    {/* TikTok */}
                    <Card className="shadow-none hover:shadow-lg transition duration-300">
                        <Card.Content className="pb-0">
                            <TikTokIcon className="w-full h-full" />
                        </Card.Content>
                        <Card.Header className="pb-0">
                            <Card.Title>TikTok Trends</Card.Title>
                            <Card.Description>
                                Create viral short videos, grow your influence, and engage with the Gen-Z audience instantly.
                            </Card.Description>
                        </Card.Header>
                        <Card.Content className="flex justify-between items-center">
                            <p className="text-lg font-semibold">1.5B+ Users</p>
                            <Button>Post on TikTok</Button>
                        </Card.Content>
                    </Card>

                    {/* Instagram */}
                    <Card className="bg-[#FF9A9E] shadow-none hover:shadow-lg transition duration-300">
                        <Card.Content className="pb-0">
                            <InstagramIcon className="w-full h-full" />
                        </Card.Content>
                        <Card.Header className="pb-0">
                            <Card.Title>Instagram Promotions</Card.Title>
                            <Card.Description>
                                Showcase photos, reels, and stories to connect with your audience and boost your brand's reach.
                            </Card.Description>
                        </Card.Header>
                        <Card.Content className="flex justify-between items-center">
                            <p className="text-lg font-semibold">2.3B+ Users</p>
                            <Button>Share on Instagram</Button>
                        </Card.Content>
                    </Card>
                </div>
            </div>
        </div>
    );
}