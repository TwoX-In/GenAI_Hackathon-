import React, { useState } from 'react';
import { Download, Eye, Youtube, Globe, Image as ImageIcon } from 'lucide-react';
import BrutalistOneToMultipleOutputs from '../../asset_generation/BrutalistBeforeAfter';

export function ProductImages({ 
    inputImages, 
    outputImages, 
    youtubeThumbnailBanner, 
    traditionalAdBanner 
}) {
    const [activeSection, setActiveSection] = useState('enhanced');

    const sections = [
        { id: 'enhanced', label: 'Enhanced Images', icon: <ImageIcon className="w-5 h-5" /> },
        { id: 'thumbnails', label: 'YouTube Thumbnails', icon: <Youtube className="w-5 h-5" /> },
        { id: 'banners', label: 'Ad Banners', icon: <Globe className="w-5 h-5" /> }
    ];

    const downloadImage = (imageBase64, filename) => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${imageBase64}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const ImageCard = ({ image, title, description, type = 'enhanced' }) => {
        const [isModalOpen, setIsModalOpen] = useState(false);

        const getBgColor = () => {
            switch (type) {
                case 'youtube': return 'bg-red-300';
                case 'banner': return 'bg-green-300';
                default: return 'bg-blue-300';
            }
        };

        return (
            <>
                <div className={`${getBgColor()} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200`}>
                    {/* Image Display */}
                    <div className="bg-white border-2 border-black mb-4 overflow-hidden">
                        <img
                            src={`data:image/png;base64,${image}`}
                            alt={title}
                            className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => setIsModalOpen(true)}
                        />
                    </div>

                    {/* Title and Description */}
                    <div className="mb-4">
                        <h4 className="font-black text-lg uppercase tracking-wide mb-1">
                            {title}
                        </h4>
                        <p className="font-bold text-sm opacity-80">
                            {description}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] font-bold text-black px-3 py-1 text-sm flex items-center gap-2 transition-all duration-150"
                        >
                            <Eye className="w-4 h-4" />
                            VIEW
                        </button>
                        
                        <button
                            onClick={() => downloadImage(image, `${title.toLowerCase().replace(/\s+/g, '_')}.png`)}
                            className="bg-yellow-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] font-bold text-black px-3 py-1 text-sm flex items-center gap-2 transition-all duration-150"
                        >
                            <Download className="w-4 h-4" />
                            DOWNLOAD
                        </button>
                    </div>
                </div>

                {/* Full Size Modal */}
                {isModalOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-4xl max-h-[90vh] overflow-auto">
                            <div className="p-4 border-b-4 border-black bg-yellow-300">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black text-xl uppercase tracking-wider">
                                        {title}
                                    </h3>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-red-500 text-white border-2 border-black px-4 py-2 font-bold hover:bg-red-600 transition-colors"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <img
                                    src={`data:image/png;base64,${image}`}
                                    alt={title}
                                    className="w-full h-auto border-2 border-black"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const renderEnhancedImages = () => {
        if (!outputImages || outputImages.length === 0) {
            return (
                <div className="bg-red-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                    <p className="text-black font-bold text-lg">NO ENHANCED IMAGES AVAILABLE!</p>
                    <p className="text-black font-medium mt-1">Enhanced images will appear here once generated</p>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Before/After Comparison */}
                <BrutalistOneToMultipleOutputs 
                    inputImageBytes={inputImages}
                    outputsData={outputImages} 
                />
                
                {/* Individual Enhanced Images */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {outputImages.map((imageData, index) => (
                        <ImageCard
                            key={index}
                            image={imageData.image}
                            title={imageData.tag || `Enhanced Image ${index + 1}`}
                            description="AI-enhanced artisan product image"
                            type="enhanced"
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderYoutubeThumbnails = () => {
        if (!youtubeThumbnailBanner) {
            return (
                <div className="bg-red-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                    <Youtube className="w-16 h-16 mx-auto mb-4 text-red-600" />
                    <p className="text-black font-bold text-lg">NO YOUTUBE THUMBNAILS AVAILABLE!</p>
                    <p className="text-black font-medium mt-1">YouTube thumbnails will appear here once generated</p>
                </div>
            );
        }

        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ImageCard
                    image={youtubeThumbnailBanner.image}
                    title="YouTube Thumbnail"
                    description="Optimized for YouTube video thumbnails"
                    type="youtube"
                />
            </div>
        );
    };

    const renderAdBanners = () => {
        const banners = [];
        
        if (youtubeThumbnailBanner) {
            banners.push({
                image: youtubeThumbnailBanner.image,
                title: "YouTube Banner",
                description: "Perfect for YouTube promotions"
            });
        }
        
        if (traditionalAdBanner) {
            banners.push({
                image: traditionalAdBanner.image,
                title: "Traditional Banner",
                description: "Ideal for social media and web"
            });
        }

        if (banners.length === 0) {
            return (
                <div className="bg-red-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-green-600" />
                    <p className="text-black font-bold text-lg">NO AD BANNERS AVAILABLE!</p>
                    <p className="text-black font-medium mt-1">Advertisement banners will appear here once generated</p>
                </div>
            );
        }

        return (
            <div className="grid gap-6 md:grid-cols-2">
                {banners.map((banner, index) => (
                    <ImageCard
                        key={index}
                        image={banner.image}
                        title={banner.title}
                        description={banner.description}
                        type="banner"
                    />
                ))}
            </div>
        );
    };

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'enhanced':
                return renderEnhancedImages();
            case 'thumbnails':
                return renderYoutubeThumbnails();
            case 'banners':
                return renderAdBanners();
            default:
                return renderEnhancedImages();
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,219,51,1)] transform rotate-1 inline-block">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider">
                        PRODUCT IMAGES
                    </h2>
                    <p className="text-lg font-bold mt-2">Enhanced visuals and marketing assets</p>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`px-4 py-2 font-bold border-2 border-black transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center gap-2 ${
                            activeSection === section.id
                                ? 'bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                    >
                        {section.icon}
                        {section.label}
                    </button>
                ))}
            </div>

            {/* Active Section Content */}
            <div className="min-h-[400px]">
                {renderActiveSection()}
            </div>

            {/* Usage Tips */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mt-8">
                <div className="flex items-center mb-4">
                    <div className="bg-yellow-300 text-black p-2 mr-4 border-2 border-black">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-wider">IMAGE USAGE GUIDE</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-100 border-2 border-black p-4">
                        <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                            ENHANCED IMAGES
                        </h4>
                        <ul className="font-bold text-sm space-y-1">
                            <li>• High-quality product photos</li>
                            <li>• Perfect for e-commerce</li>
                            <li>• Professional presentation</li>
                            <li>• Multiple variations available</li>
                        </ul>
                    </div>
                    
                    <div className="bg-red-100 border-2 border-black p-4">
                        <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                            <Youtube className="w-5 h-5 text-red-600" />
                            YOUTUBE THUMBNAILS
                        </h4>
                        <ul className="font-bold text-sm space-y-1">
                            <li>• Optimized for video thumbnails</li>
                            <li>• Eye-catching designs</li>
                            <li>• Perfect aspect ratio</li>
                            <li>• Increase click-through rates</li>
                        </ul>
                    </div>
                    
                    <div className="bg-green-100 border-2 border-black p-4">
                        <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-green-600" />
                            AD BANNERS
                        </h4>
                        <ul className="font-bold text-sm space-y-1">
                            <li>• Ready for advertising campaigns</li>
                            <li>• Multiple format options</li>
                            <li>• Social media optimized</li>
                            <li>• Professional marketing assets</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

