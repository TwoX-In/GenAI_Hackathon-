import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/retroui/Button";
import { SocialMediaGrid } from "./social_media_grid";
import { CustomerList } from "./customer_list";
import { useLoaderData, useParams } from "react-router-dom";
import BrutalistOneToMultipleOutputs from "./BrutalistBeforeAfter";
import Faqs from "./Faqs";
import ArtisanProductStory from "./ArtisanProductStory";
import AssetsOverview from "./GenOverview";
import HistoryDisplay from "./HistoryDisplay";
import { VideoComponent } from "./OutputVideos";
import { SocialMediaPreview } from "./SocialMediaPreview";
import { LocationMap } from "./LocationMap";
import { Request } from "@/request/request";
import AdBanners from "./AdBanners";
import ComicSection from "./ComicSection";
import InventoryRecommendations from "./InventoryRecommendations";
import EmailMarketing from "@/components/email/EmailMarketing";
import { UnifiedImages } from "./UnifiedImages";


const tabs = [
    { id: "Overview", label: "Overview" },
    { id: "Images", label: "Images" },
    { id: "Product History", label: "History" },
    { id: "Product Story", label: "Story" },
    { id: "Location Map", label: "Origin Map" },
    { id: "Inventory Recommendations", label: "Inventory Ideas" },
    { id: "Comic Stories", label: "Comic Stories" },
    { id: "Email Marketing", label: "Email Marketing" },
    { id: "Social Media Preview", label: "Post Previews" },
    { id: "Social Media Posts", label: "Social Media" },
    { id: "Output Videos", label: "Video Assets" },
    { id: "Customer Recommendations", label: "Reviews" },
    { id: "Product Faqs", label: "FAQs" },
];








export function AssetGen() {
    let data = useLoaderData();
    const [activeTab, setActiveTab] = useState("Overview");
    const [videos, setVideos] = useState([])
    const [highlightedLocationText, setHighlightedLocationText] = useState({ highlights: [], key_terms: [] });
    const [highlightedStoryText, setHighlightedStoryText] = useState({ highlights: [], key_terms: [] });
    const { id } = useParams();
    console.log("DATA", data)
    
    
    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                
                let res1 = await Request.postByUrl("/highlight/text", { text: data.history.location_specific_info });
                let res2 = await Request.postByUrl("/highlight/text", { text: data.history.descriptive_history });
                setHighlightedLocationText(res1);
                setHighlightedStoryText(res2);


                console.log("Highlight API response location:", res1);
                console.log("Highlight API response descriptive:", res2);
            } catch (err) {
                console.error("Highlight API error:", err);
            }
        };
        let vids = [];
        vids.push(data.outputVideos.video)
        setVideos(vids)
        console.log(videos.length)
        fetchHighlights();
        console.log(highlightedLocationText);
        console.log(highlightedStoryText);


    }, []);



    let inputImageBytes = data.inputImages;
    let outputImageBytes = data.outputImages;
    let faqs = data.faqs;
    let story = data.story;

    console.log("NIGGA", data);
    
    return (
        <div className="min-h-screen bg-[#fdfbf6] py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,219,51,1)] transform -rotate-1 inline-block">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">
                            Asset Generation Results
                        </h1>
                        <p className="text-lg font-bold mt-2">Complete analysis and enhancement suite</p>
                    </div>
                </div>

                <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">

                    {/* Tabs Header */}
                    <div className="flex flex-wrap gap-2 justify-center border-black p-4 bg-white">
                        {tabs.map((tab) => (
                            <Button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-3 py-2 font-bold border-2 border-black transition-all duration-150 text-sm md:text-base",
                                    "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
                                    "min-w-fit whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                        : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                )}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6 border-4 border-black p-6 bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[600px]">
                        {activeTab === "Overview" &&
                            <AssetsOverview
                                processing_metadata={data.processingMetadata}
                                product_title={"Zardozi art"}
                                product_artist={data.predictedArtist.predicted_artist}
                                product_style={data.productStyle.style}
                                product_origin={data.productOrigin.origin}
                                product_predicted_artist={data.predictedArtist.predicted_artist}
                                product_medium={data.productMedium.medium}
                                product_themes={data.productThemes.themes}
                                product_colors={data.productColors.colors}
                                product_price={Math.round(data.recommendedPrice.price / 1000) * 1000}
                            />}
                        {activeTab === "Images" && (
                            <UnifiedImages
                                inputImages={inputImageBytes}
                                outputImages={outputImageBytes}
                                youtubeThumbnailBanner={data.youtubeThumbnailBanner}
                                traditionalAdBanner={data.traditionalAdBanner}
                            />
                        )}

                        {activeTab === "Customer Recommendations" && <CustomerList />}
                        {activeTab === "Social Media Preview" && (
                            <SocialMediaPreview 
                                uid={data.uid || 123}
                                story={story}
                                outputImages={outputImageBytes}
                                videos={videos}
                                productMedium={data.productMedium}
                                productColors={data.productColors}
                                productOrigin={data.productOrigin}
                                predictedArtist={data.predictedArtist}
                            />
                        )}
                        {activeTab === "Social Media Posts" && <SocialMediaGrid uid={id} />}
                        {activeTab === "Comic Stories" && <ComicSection comicImage={data.comics["image"]} />}
                        {activeTab === "Email Marketing" && (
                            <EmailMarketing 
                                emailHtml={data.emailHtml}
                                uid={data.uid || id}
                            />
                        )}
                        {activeTab === "Product Faqs" && <Faqs questions={faqs} />}
                        {activeTab === "Product Story" && <ArtisanProductStory
                            productHeader={"Zaradozi Art "} productStory={story.story}
                            productArtist=""
                            productPrice={Math.round(data.recommendedPrice.price / 1000) * 1000}
                            productOrigins={data.productOrigin.origin}
                            productStyle={data.productStyle.style}
                        />}
                        {activeTab === "Location Map" && (
                            <LocationMap 
                                locations={Array.isArray(data.productOrigin.origin) 
                                    ? data.productOrigin.origin 
                                    : [data.productOrigin.origin]
                                    
                                }
                                locationHistory={data.history.location_specific_info}
                            />
                        )}
                        {activeTab === "Inventory Recommendations" && (
                            <InventoryRecommendations recs={data.recs} />
                        )}
                        {activeTab === "Product History"
                            && <HistoryDisplay
                                uid={data.history.uid}
                                descriptive_history={data.history.descriptive_history}
                                location_specific_info={data.history.location_specific_info}
                                history_highlights={highlightedStoryText}
                                location_highlights={highlightedLocationText}
                                
 
 
                            />}
                        {activeTab === "Output Videos" && (
                            <VideoComponent 
                                videos={videos} 
                                editedVideo={data.edited_video}
                                reelVideo={data.reel_video}
                                productId={id}
                                productTitle={data.productStyle?.style + " from " + data.productOrigin?.origin + " by " + data.predictedArtist?.predicted_artist}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
                