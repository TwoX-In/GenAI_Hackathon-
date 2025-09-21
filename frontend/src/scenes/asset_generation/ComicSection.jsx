import React, { useState } from 'react';
import { Download, Copy, Check, BookOpen, Zap, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/retroui/Button';

const ComicSection = ({ comicImage }) => {
    const [copiedImage, setCopiedImage] = useState(null);
    const [selectedComic, setSelectedComic] = useState(0);

    // Single comic data structure
    const comics = comicImage ? [
        {
            title: "ARTISAN'S JOURNEY",
            image: comicImage,
            description: "The story of craftsmanship through comic panels",
            panels: 4,
            style: "Traditional"
        }
    ] : [];

    const downloadComic = (comic) => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${comic.image}`;
        link.download = `${comic.title.toLowerCase().replace(/\s+/g, '_')}_comic.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToClipboard = async (comic, index) => {
        try {
            const response = await fetch(`data:image/png;base64,${comic.image}`);
            const blob = await response.blob();
            
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]);
            
            setCopiedImage(index);
            setTimeout(() => setCopiedImage(null), 2000);
        } catch (err) {
            console.error('Failed to copy image:', err);
        }
    };

    const ComicCard = ({ comic, index, isSelected, onClick }) => {
        const rotationClass = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
        const hoverRotation = index % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1';
        const bgColors = ['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400'];
        const bgColor = bgColors[index % bgColors.length];

        return (
            <div 
                className={`${bgColor} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 transform ${rotationClass} ${hoverRotation} transition-all duration-300 cursor-pointer ${
                    isSelected ? 'scale-105 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : ''
                }`}
                onClick={onClick}
            >
                {/* Comic Thumbnail */}
                <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 mb-3">
                    <img
                        src={`data:image/png;base64,${comic.image}`}
                        alt={comic.title}
                        className="w-full h-24 object-cover border-2 border-black"
                    />
                    
                    {/* Panel Count Badge */}
                    <div className="absolute top-1 right-1 bg-yellow-300 border-2 border-black px-2 py-1 transform rotate-12">
                        <span className="font-black text-xs">{comic.panels || 4} PANELS</span>
                    </div>
                </div>

                {/* Comic Info */}
                <div className="text-center">
                    <h4 className="font-black text-sm uppercase tracking-wider mb-1">
                        {comic.title}
                    </h4>
                    <p className="text-xs font-bold opacity-80">{comic.style}</p>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-yellow-300 border-2 border-black rounded-full p-1">
                        <Star className="w-4 h-4" fill="currentColor" />
                    </div>
                )}
            </div>
        );
    };

    const MainComicDisplay = ({ comic, index }) => {
        return (
            <div className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-6 transform hover:rotate-1 transition-all duration-300">
                {/* Comic Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-black text-white p-3 border-2 border-black">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-wider">
                                {comic.title}
                            </h2>
                            <p className="text-lg font-bold text-gray-600">{comic.description}</p>
                        </div>
                    </div>
                    
                    {/* Comic Style Badge */}
                    <div className="bg-purple-300 border-3 border-black px-4 py-2 transform -rotate-2">
                        <span className="font-black text-sm uppercase">{comic.style} STYLE</span>
                    </div>
                </div>

                {/* Main Comic Image */}
                <div className="bg-gray-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-3 mb-6">
                    <div className="relative">
                        <img
                            src={`data:image/png;base64,${comic.image}`}
                            alt={comic.title}
                            className="w-full h-auto border-2 border-black"
                            style={{ maxHeight: '500px', objectFit: 'contain' }}
                        />
                        
                        {/* Comic Speech Bubble Effect */}
                        <div className="absolute top-4 left-4 bg-white border-3 border-black px-4 py-2 transform rotate-3">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4" fill="currentColor" />
                                <span className="font-black text-sm">COMIC MAGIC!</span>
                            </div>
                        </div>
                        
                        {/* Panel Count Display */}
                        <div className="absolute bottom-4 right-4 bg-yellow-300 border-3 border-black px-3 py-2 transform -rotate-2">
                            <span className="font-black text-lg">{comic.panels || 4} PANELS</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                        onClick={() => downloadComic(comic)}
                        className="bg-green-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] font-black text-black px-6 py-3 text-lg uppercase tracking-wider transform hover:rotate-1 transition-all duration-200"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        DOWNLOAD COMIC
                    </Button>
                    
                    <Button
                        onClick={() => copyToClipboard(comic, index)}
                        className={`border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] font-black px-6 py-3 text-lg uppercase tracking-wider transform hover:-rotate-1 transition-all duration-200 ${
                            copiedImage === index 
                                ? 'bg-yellow-300 text-black' 
                                : 'bg-blue-300 text-black'
                        }`}
                    >
                        {copiedImage === index ? (
                            <>
                                <Check className="w-5 h-5 mr-2" />
                                COPIED!
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5 mr-2" />
                                COPY COMIC
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Simple Header */}
            <div className="text-center mb-6">
                <div className="bg-black text-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,219,51,1)] inline-block">
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider">
                        COMIC STORY
                    </h1>
                </div>
            </div>

            {comics.length === 0 ? (
                /* No Comics State */
                <div className="min-h-[300px] flex items-center justify-center">
                    <div className="bg-gray-200 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
                        <div className="text-center">
                            <BookOpen className="w-12 h-12 mx-auto mb-3" />
                            <p className="text-xl font-black uppercase">NO COMIC YET</p>
                        </div>
                    </div>
                </div>
            ) : (
                /* Main Comic Display - Simplified */
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4">
                    {/* Comic Image - Takes Center Stage */}
                    <div className="mb-4">
                        <img
                            src={`data:image/png;base64,${comics[0].image}`}
                            alt="Comic Story"
                            className="w-full h-auto border-2 border-black"
                            style={{ maxHeight: 'none' }}
                        />
                    </div>

                    {/* Simple Action Buttons */}
                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={() => downloadComic(comics[0])}
                            className="bg-green-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] font-bold text-black px-4 py-2 flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            DOWNLOAD
                        </Button>
                        
                        <Button
                            onClick={() => copyToClipboard(comics[0], 0)}
                            className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] font-bold flex items-center gap-2 ${
                                copiedImage === 0 
                                    ? 'bg-yellow-300 text-black' 
                                    : 'bg-blue-300 text-black'
                            }`}
                        >
                            {copiedImage === 0 ? (
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
             )}
        </div>
    );
};

export default ComicSection;
