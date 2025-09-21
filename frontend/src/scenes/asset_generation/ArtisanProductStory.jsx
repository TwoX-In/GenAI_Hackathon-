import React, { useState } from 'react';
import TranslationBox from "@/components/translation/TranslationBox";

const ArtisanProductStory = ({ productHeader, productStory, productArtist="", 
productPrice,  productOrigins, productStyle}) => {
    const [isReading, setIsReading] = useState(false);

    return (
        <div className="min-h-screen bg-[#FF9A9E] p-4 md:p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <div className="bg-[#A8E6CF] border-4 border-[#2A2A2A] shadow-[12px_12px_0px_0px_#2A2A2A] p-8 transform -rotate-1">
                        <h1 className="text-5xl md:text-7xl font-black text-[#2A2A2A] mb-4 transform rotate-1">
                            {productHeader}
                        </h1>
                        <TranslationBox text={productHeader} label="Translate title" />
                        <div className="bg-[#FFD93D] border-2 border-[#2A2A2A] p-3 inline-block transform rotate-2">
                            <span className="text-lg font-black text-[#2A2A2A]">
                                A Story by फनकार.ai
                            </span>
                        </div>
                    </div>
                </div>

                {/* Story Text Block */}
                <div className="mb-12">
                    <div className="bg-[#88D8FF] border-4 border-[#2A2A2A] shadow-[10px_10px_0px_0px_#2A2A2A] p-8 md:p-12 transform -rotate-1">
                        <div
                            className={`font-medium text-lg md:text-xl leading-relaxed transition-all duration-1000 ${isReading ? 'text-[#2A2A2A]' : 'text-[#2A2A2A]/80'
                                }`}
                            onMouseEnter={() => setIsReading(true)}
                            onMouseLeave={() => setIsReading(false)}
                        >
                            {productStory}
                        </div>
                        <TranslationBox text={productStory} label="Translate story" />
                    </div>
                </div>

                {/* Price & Purchase */}
                <div className="mb-8">
                    <div className="bg-[#FFD93D] border-4 border-[#2A2A2A] shadow-[8px_8px_0px_0px_#2A2A2A] p-6 transform rotate-1 text-center">
                        <div className="text-4xl font-black text-[#2A2A2A] mb-4">Rs. {productPrice}</div>
                        <button className="bg-[#A8E6CF] border-3 border-[#2A2A2A] shadow-[6px_6px_0px_0px_#2A2A2A] px-8 py-4 font-black text-[#2A2A2A] uppercase tracking-wider text-lg hover:shadow-[3px_3px_0px_0px_#2A2A2A] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 transform hover:scale-105">
                            Bring This Story Home
                        </button>
                    </div>
                </div>

                {/* Artist Signature */}
                <div className="text-center">
                    <div className="bg-[#A8E6CF] border-3 border-[#2A2A2A] shadow-[6px_6px_0px_0px_#2A2A2A] p-4 inline-block transform -rotate-1">
                        <span className="text-[#2A2A2A] font-black text-lg">
                            — {productArtist}, {productStyle} Artist
                        </span>
                        <div className="text-sm text-[#2A2A2A]/80 font-medium mt-1">
                            {productOrigins} • Since Forever
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ArtisanProductStory;
