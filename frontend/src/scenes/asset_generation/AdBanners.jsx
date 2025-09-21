import React, { useState, useEffect } from 'react';
import { Download, Youtube, Globe, Copy, Check } from 'lucide-react';
import { Button } from '@/components/retroui/Button';
import { Request } from '@/request/request';

const AdBanners = ({ youtubeBase64, traditionalBase64 }) => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedBanner, setCopiedBanner] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                
                setBanners([
                    {
                        tag: "YouTube Advertisement",
                        image: youtubeBase64,
                        type: "youtube",
                        description: "Optimized for YouTube video promotions and channel banners",
                        dimensions: "1200 × 628px"
                    },
                    {
                        tag: "Traditional Advertisement", 
                        image: traditionalBase64,
                        type: "traditional",
                        description: "Perfect for social media posts and general marketing",
                        dimensions: "1200 × 628px"
                    }
                ]);
            } catch (err) {
                console.error('Error fetching banners:', err);
                setError('Failed to load advertisement banners');
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    

    const downloadBanner = (banner) => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${banner.image}`;
        link.download = `${banner.tag.toLowerCase().replace(/\s+/g, '_')}_banner.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToClipboard = async (banner) => {
        try {
            // Convert base64 to blob
            const response = await fetch(`data:image/png;base64,${banner.image}`);
            const blob = await response.blob();
            
            // Copy to clipboard
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]);
            
            setCopiedBanner(banner.type);
            setTimeout(() => setCopiedBanner(null), 2000);
        } catch (err) {
            console.error('Failed to copy image:', err);
        }
    };

    const BannerCard = ({ banner }) => {
        const isYoutube = banner.type === 'youtube';
        const cardColor = isYoutube ? 'bg-red-400' : 'bg-green-400';
        const iconColor = isYoutube ? 'text-red-600' : 'text-green-600';
        
        return (
            <div className={`${cardColor} border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 transform hover:-rotate-1 transition-all duration-300`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-black text-white p-2 border-2 border-black">
                            {isYoutube ? (
                                <Youtube className={`w-6 h-6 ${iconColor}`} fill="currentColor" />
                            ) : (
                                <Globe className={`w-6 h-6 ${iconColor}`} />
                            )}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-wider">
                                {banner.tag}
                            </h3>
                            <p className="text-sm font-bold opacity-80">
                                {banner.dimensions}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Banner Image */}
                <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4 p-2">
                    <img
                        src={`data:image/png;base64,${banner.image}`}
                        alt={banner.tag}
                        className="w-full h-auto border-2 border-black"
                        style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                </div>

                {/* Description */}
                <div className="bg-black text-white p-3 border-2 border-black mb-4">
                    <p className="font-bold text-sm">{banner.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                    <Button
                        onClick={() => downloadBanner(banner)}
                        className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] font-bold text-black flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        DOWNLOAD
                    </Button>
                    
                    <Button
                        onClick={() => copyToClipboard(banner)}
                        className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] font-bold flex items-center gap-2 ${
                            copiedBanner === banner.type 
                                ? 'bg-yellow-300 text-black' 
                                : 'bg-white text-black'
                        }`}
                    >
                        {copiedBanner === banner.type ? (
                            <>
                                <Check className="w-4 h-4" />
                                COPIED!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                COPY
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 transform rotate-2">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
                        <p className="text-2xl font-black uppercase tracking-wider">
                            GENERATING BANNERS...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="bg-red-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 transform -rotate-1">
                    <p className="text-2xl font-black uppercase tracking-wider text-white">
                        {error}
                    </p>
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
                        ADVERTISEMENT BANNERS
                    </h2>
                    <p className="text-lg font-bold mt-2">Ready-to-use promotional assets</p>
                </div>
            </div>

            {/* Banner Grid */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                {banners.map((banner, index) => (
                    <BannerCard key={index} banner={banner} />
                ))}
            </div>

            {/* Usage Tips */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mt-8">
                <div className="flex items-center mb-4">
                    <div className="bg-yellow-300 text-black p-2 mr-4 border-2 border-black">
                        <Globe className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-wider">USAGE TIPS</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-100 border-2 border-black p-4">
                        <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                            <Youtube className="w-5 h-5 text-red-600" />
                            YOUTUBE BANNER
                        </h4>
                        <ul className="font-bold text-sm space-y-1">
                            <li>• Perfect for video thumbnails</li>
                            <li>• Use in YouTube channel art</li>
                            <li>• Great for video promotions</li>
                            <li>• Optimized for social sharing</li>
                        </ul>
                    </div>
                    
                    <div className="bg-green-100 border-2 border-black p-4">
                        <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-green-600" />
                            TRADITIONAL BANNER
                        </h4>
                        <ul className="font-bold text-sm space-y-1">
                            <li>• Ideal for social media posts</li>
                            <li>• Use in email campaigns</li>
                            <li>• Perfect for website headers</li>
                            <li>• Great for print materials</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdBanners;
