import React from "react";
import { Text } from "@/components/retroui/Text";
import ProductOverview from "../ProductOverview";
import ArtisanProductStory from "../../asset_generation/ArtisanProductStory";
import HistoryDisplay from "../../asset_generation/HistoryDisplay";
import Faqs from "../../asset_generation/Faqs";
import { ProductVideos } from "./ProductVideos";
import { ProductImages } from "./ProductImages";
import { LocationMap } from "../../asset_generation/LocationMap";
import AdBanners from "../../asset_generation/AdBanners";
import ThreeDViewer from "@/components/3d/ThreeDViewer";

export function ProductTabContent({ activeTab, data, price }) {
    
    console.log("FUCKKK NOO", data);
    
    const renderTabContent = () => {
        switch (activeTab) {
            case "Overview":
                return (
                    <ProductOverview
                        productTitle={data.productTitle?.title}
                        productArtist={data.productStyle?.style}
                        productStyle={data.productStyle?.style}
                        productOrigin={data.productOrigin?.origin}
                        predictedArtist={data.predictedArtist?.predicted_artist}
                        productMedium={data.productMedium?.medium}
                        productThemes={data.productThemes?.themes}
                        productColors={data.productColors?.colors}
                        productPrice={price}
                        rating={4.8}
                        outputImages={data.outputImages}
                    />
                );

            case "Product Story":
                return (
                    <ArtisanProductStory
                        productHeader={data.productTitle?.title || "Artisan Product"}
                        productStory={data.story?.story || "No story available for this product."}
                        productArtist={data.predictedArtist?.predicted_artist || ""}
                        productPrice={price}
                        productOrigins={data.productOrigin?.origin || ""}
                        productStyle={data.productStyle?.style || ""}
                    />
                );

            case "Product History":
                return (
                    <HistoryDisplay
                        uid={data.history?.uid || "N/A"}
                        location_specific_info={data.history?.location_specific_info || "No location information available."}
                        descriptive_history={data.history?.descriptive_history || "No historical information available."}
                        location_highlights={data.history.highlightedLocationText}
                        history_highlights={data.history.highlightedStoryText}
                    />
                );

            case "Product FAQs":
                return (
                    <div className="max-w-4xl mx-auto">
                        {data.faqs && data.faqs.length > 0 ? (
                            <Faqs questions={data.faqs} />
                        ) : (
                            <div className="bg-yellow-200 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                                <Text className="font-bold text-xl">
                                    No FAQs available for this product.
                                </Text>
                            </div>
                        )}
                    </div>
                );

            case "Images":
                return (
                    <ProductImages
                        inputImages={data.inputImages || []}
                        outputImages={data.outputImages || []}
                        youtubeThumbnailBanner={data.youtubeThumbnailBanner}
                        traditionalAdBanner={data.traditionalAdBanner}
                    />
                );

            case "3D Experience":
                return (
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-6 text-center">
                            <Text className="text-2xl font-bold mb-2">3D Product Experience</Text>
                            <Text className="text-gray-600">
                                Explore your product in immersive 3D with interactive controls
                            </Text>
                        </div>
                        <ThreeDViewer 
                            images={data.outputImages || []}
                        />
                    </div>
                );

            case "Origin Map":
                return (
                    <LocationMap 
                        locations={Array.isArray(data.productOrigin?.origin) 
                            ? data.productOrigin.origin 
                            : [data.productOrigin?.origin || "Unknown"]
                        }
                        locationHistory={data.history?.location_specific_info || "No location information available."}
                    />
                );

            case "Ad Banners":
                return (
                    <AdBanners 
                        youtubeBase64={data.youtubeThumbnailBanner?.image} 
                        traditionalBase64={data.traditionalAdBanner?.image} 
                    />
                );

            case "Product Videos":
                return (
                    <ProductVideos
                        productId={data.productTitle?.id || data.recommendedPrice?.uid}
                        productTitle={data.productTitle?.title}
                        videos={data.videos || []}
                        editedVideo={data.edited_video}
                        reelVideo={data.reel_video}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-[600px]">
            {renderTabContent()}
        </div>
    );
}