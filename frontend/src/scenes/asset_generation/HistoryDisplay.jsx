import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Hash, Crown, Sparkles, Scroll } from 'lucide-react';
import { Request } from '@/request/request';
import TranslationBox from "@/components/translation/TranslationBox";

const HistoryDisplay = ({uid, location_specific_info, descriptive_history, location_highlights, history_highlights}) => {
    const [craftData] = useState({
        "uid": uid,
        "location_specific_info": location_specific_info,     
        "descriptive_history": descriptive_history
    });
    const HighlightedText = ({ text, highlights }) => {
        if (!highlights || highlights.length === 0) return <span>{text}</span>;

        const sorted = [...highlights].sort((a, b) => a.start - b.start);

        let lastIndex = 0;
        const parts = [];

        sorted.forEach((h, idx) => {
            // Push plain text before highlight
            if (h.start > lastIndex) {
                parts.push(<span key={`t-${idx}`}>{text.slice(lastIndex, h.start)}</span>);
            }

            const categoryStyles = {
                location: "bg-red-400 text-black font-black px-2 py-1 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mx-1",
                time: "bg-purple-400 text-black font-black px-3 py-1 border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] mx-1 inline-block transform -skew-x-12",
                organization: "bg-blue-400 text-black font-black px-2 py-1 border-2 border-black shadow mx-1",
                person: "bg-green-400 text-black font-black px-2 py-1 border-2 border-black shadow mx-1",
            };

            // Use slice instead of h.phrase
            parts.push(
                <span
                    key={`h-${idx}`}
                    className={categoryStyles[h.category] || "bg-yellow-200"}
                    title={h.tooltip}
                >
                    {text.slice(h.start, h.end)}
                </span>
            );

            lastIndex = h.end;
        });

        if (lastIndex < text.length) {
            parts.push(<span key="last">{text.slice(lastIndex)}</span>);
        }

        return <div className="text-lg leading-relaxed font-bold">{parts}</div>;
    };
    const BlockSection = ({ icon: Icon, title, children, bgColor = "bg-white", textColor = "text-black" }) => (
        <div className={`${bgColor} ${textColor} border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] mb-8 transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`}>
            <div className="bg-black text-white p-6 flex items-center">
                <div className="bg-white text-black p-3 mr-6 border-4 border-white">
                    <Icon size={32} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-[0.2em]">{title}</h2>
            </div>
            <div className="p-8">
                {children}
            </div>
        </div>
    );

    const UidBadge = ({ uid }) => (
        <div className="bg-yellow-400 border-6 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-8 transform rotate-1">
            <div className="flex items-center justify-center">
                <Hash size={40} strokeWidth={4} className="mr-4" />
                <div className="text-center">
                    <div className="text-sm font-black uppercase tracking-widest mb-1">UNIQUE IDENTIFIER</div>
                    <div className="text-4xl font-black">{uid}</div>
                </div>
            </div>
        </div>
    );

    const LocationHighlights = ({ text }) => {
        console.log("Location Highlights:", text);
        const { highlights } =location_highlights;
        return <HighlightedText text={text} highlights={highlights} />;
    };

    const HistoryTimeline = ({ text }) => {
        console.log("History Highlights:", text);
        const { highlights } = history_highlights;
        return <HighlightedText text={text} highlights={highlights} />;
    };

    const KeyTerms = ({ text }) => {
        const { key_terms } =history_highlights;

        return (
            <div className="mt-6">
                <div className="text-sm font-black uppercase tracking-widest mb-4 text-gray-700">
                    KEY TERMS EXTRACTED:
                </div>
                <div className="flex flex-wrap gap-4">
                    {key_terms.map((term, index) => (
                        <div
                            key={index}
                            className="bg-black text-white px-4 py-2 border-4 border-black shadow-[6px_6px_0px_rgba(255,255,255,1)] font-black text-sm transform hover:scale-105 transition-transform"
                        >
                            {term.toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 p-6 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="bg-black text-white p-12 mb-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] border-8 border-black transform -rotate-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-wider mb-4">
                                ZARDOZI
                            </h1>
                            <div className="text-2xl font-bold uppercase tracking-widest">
                                CRAFT DATA INTERFACE
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Crown size={80} strokeWidth={3} className="text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* UID Badge */}
                <UidBadge uid={craftData.uid} />

                {/* Location Info */}
                <BlockSection
                    icon={MapPin}
                    title="LOCATION INTELLIGENCE"
                    bgColor="bg-cyan-300"
                >
                    <LocationHighlights text={craftData.location_specific_info} />
                    <TranslationBox text={craftData.location_specific_info} label="Translate location info" />
                    <div className="mt-6 bg-black text-cyan-300 p-4 border-4 border-black font-mono">
                        <div className="text-sm font-black">GEOGRAPHIC STATUS: ACTIVE</div>
                        <div className="text-sm font-black">GI TAG: VERIFIED ✓</div>
                        <div className="text-sm font-black">HERITAGE SITES: 4 MAJOR CENTERS</div>
                    </div>
                </BlockSection>

                {/* History */}
                <BlockSection
                    icon={Scroll}
                    title="HISTORICAL ARCHIVE"
                    bgColor="bg-lime-300"
                >
                    <HistoryTimeline text={craftData.descriptive_history} />
                    <TranslationBox text={craftData.descriptive_history} label="Translate history" />
                    <KeyTerms text={craftData.descriptive_history}/>
                </BlockSection>

                {/* Data Summary */}
                <div className="bg-purple-600 text-white border-8 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div className="bg-white text-purple-600 p-6 border-4 border-black font-black">
                            <div className="text-3xl mb-2">1</div>
                            <div className="text-sm uppercase tracking-wider">CRAFT RECORD</div>
                        </div>
                        <div className="bg-white text-purple-600 p-6 border-4 border-black font-black">
                            <div className="text-3xl mb-2">4</div>
                            <div className="text-sm uppercase tracking-wider">MAJOR CITIES</div>
                        </div>
                        <div className="bg-white text-purple-600 p-6 border-4 border-black font-black">
                            <div className="text-3xl mb-2">400+</div>
                            <div className="text-sm uppercase tracking-wider">YEARS HISTORY</div>
                        </div>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="mt-8 bg-black text-green-400 p-6 font-mono text-center text-xl font-black uppercase tracking-widest border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    ● DATA LOADED SUCCESSFULLY ● STATUS: OPERATIONAL ● HERITAGE: PRESERVED ●
                </div>

            </div>
        </div>
    );
};

export default HistoryDisplay;