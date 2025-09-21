import React, { useState } from 'react';
import { Database, Palette, Tags, DollarSign } from 'lucide-react';

const AssetsOverview = ({
    processing_metadata,
    product_title,
    product_artist,
    product_style,
    product_origin,
    product_predicted_artist,
    product_medium,
    product_themes,
    product_colors,
    product_price
}) => {
    const [productData] = useState({
        processing_metadata: processing_metadata,
        product_title: product_title,
        product_artist: product_artist,
        product_style: product_style,
        product_origin: product_origin,
        product_predicted_artist: product_predicted_artist,
        product_medium: product_medium,
        product_themes: product_themes.split(","),
        product_colors: product_colors?.split(","),
        product_price: Number(product_price) || 0,
    });

    // Calculate ±10% price range
    const minPrice = (productData.product_price * 0.9).toFixed(2);
    const maxPrice = (productData.product_price * 1.1).toFixed(2);

    const DataSection = ({ icon: Icon, title, children, bgColor = "bg-white" }) => (
        <div className={`${bgColor} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6`}>
            <div className="flex items-center mb-4">
                <div className="bg-black text-white p-2 mr-4">
                    <Icon size={24} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-wider">{title}</h2>
            </div>
            {children}
        </div>
    );

    const MetadataGrid = ({ data }) => (
        <div className="grid grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="bg-gray-100 border-2 border-black p-3">
                    <div className="text-xs font-bold uppercase mb-1 text-gray-600">{key.replace(/_/g, ' ')}</div>
                    <div className="font-mono text-sm">{typeof value === 'object' ? JSON.stringify(value) : value}</div>
                </div>
            ))}
        </div>
    );

    const ColorPalette = ({ colors }) => (
        <div className="flex flex-wrap gap-3">
            {colors.map((color, index) => (
                <div
                    key={index}
                    className="flex items-center bg-black text-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    <div
                        className="w-6 h-6 border-2 border-white mr-3"
                        style={{
                            backgroundColor:
                                color.toLowerCase().includes("blue") ? "#1e40af" :
                                    color.toLowerCase().includes("yellow") ? "#fbbf24" :
                                        color.toLowerCase().includes("white") ? "#ffffff" : "#374151",
                        }}
                    ></div>
                    <span className="font-bold text-sm">{color}</span>
                </div>
            ))}
        </div>
    );

    const ThemesList = ({ themes }) => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {themes.map((theme, index) => (
                <div
                    key={index}
                    className="bg-yellow-300 border-3 border-black px-4 py-3 text-center font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    {theme}
                </div>
            ))}
        </div>
    );

    const InfoBlock = ({ label, value, bgColor = "bg-gray-200" }) => (
        <div className={`${bgColor} border-2 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4`}>
            <div className="text-xs font-black uppercase tracking-wider mb-2 text-gray-700">{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    );

    const PriceHighlight = ({ min, max }) => (
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-8 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center mb-10">
            <div className="flex justify-center items-center mb-4">
                
                <h2 className="text-4xl font-extrabold uppercase">Recommended Price</h2>
            </div>
            <div className="text-5xl font-black tracking-wide">
                ₹{min} – {max}
            </div>
            <div className="mt-2 text-sm uppercase font-mono">Estimated ±10% range</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-red-400 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-black text-white p-8 mb-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider mb-2">
                        PRODUCT DATA
                    </h1>
                    <div className="text-xl font-bold">An overview of the generated product data</div>
                </div>

                {/* Price Highlight */}
                <PriceHighlight min={minPrice} max={maxPrice} />

                {/* Main Product Info Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <InfoBlock label="PRODUCT TITLE" value={productData.product_title} bgColor="bg-white" />
                        <InfoBlock label="ARTIST" value={productData.product_artist} bgColor="bg-white" />
                        <InfoBlock label="STYLE" value={productData.product_style} bgColor="bg-white" />
                        <InfoBlock label="ORIGIN" value={productData.product_origin} bgColor="bg-white" />
                    </div>
                    <div>
                        <InfoBlock label="PREDICTED ARTIST" value={productData.product_predicted_artist} bgColor="bg-white" />
                        <InfoBlock label="MEDIUM" value={productData.product_medium} bgColor="bg-white" />
                    </div>
                </div>

                {/* Themes */}
                <DataSection icon={Tags} title="PRODUCT THEMES" bgColor="bg-white">
                    <ThemesList themes={productData.product_themes} />
                </DataSection>

                {/* Colors */}
                <DataSection icon={Palette} title="PRODUCT COLORS" bgColor="bg-white">
                    <ColorPalette colors={productData.product_colors} />
                </DataSection>

                {/* Processing Metadata */}
                <DataSection icon={Database} title="PROCESSING METADATA" bgColor="bg-lime-300">
                    <MetadataGrid data={productData.processing_metadata} />
                </DataSection>

                {/* Status Bar */}
                <div className="bg-black text-lime-300 p-4 font-mono text-lg font-bold uppercase tracking-widest text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
                    ✅ ALL SYSTEMS OPERATIONAL • DATA PROCESSING COMPLETE • STATUS: ACTIVE
                </div>
            </div>
        </div>
    );
};

export default AssetsOverview;
