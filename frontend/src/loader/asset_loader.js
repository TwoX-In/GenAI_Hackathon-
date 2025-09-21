import { Request } from "@/request/request";

export const MetadataLoader = async (params) => {
  try {
    let id = params.params.id;
    console.log("=== ASSET LOADER DEBUG ===");
    console.log("Loading metadata for ID:", id);
    console.log("Params:", params);

    // Fetch all endpoints in parallel
    const [
      inputImages,
      outputImages,
      recommendedPrice,
      processingMetadata,
      faqs,
      story,
      history,
      productStyle,
      productOrigin,
      predictedArtist,
      productMedium,
      productThemes,
      productColors,
      outputVideos,
      edited_video,
      reel_video,
      traditionalAdBanner,
      youtubeThumbnailBanner,
      comics,
      inventoryRecommendations,
      emailHtml
    ] = await Promise.all([
      Request.get(`/storage/input_images/${id}`),
      Request.get(`/storage/output_images/${id}`),
      Request.get(`/storage/recommended_price/${id}`),
      Request.get(`/storage/processing_metadata/${id}`),
      Request.get(`/storage/faqs/${id}`),
      Request.get(`/storage/story/${id}`),
      Request.get(`/storage/history/${id}`),
      Request.get(`/storage/style/${id}`),
      Request.get(`/storage/origin/${id}`),
      Request.get(`/storage/predicted_artist/${id}`),
      Request.get(`/storage/medium/${id}`),
      Request.get(`/storage/themes/${id}`),
      Request.get(`/storage/colors/${id}`),
      Request.get(`/storage/edited_video/${id}`),
      Request.get(`/storage/edited_video/${id}`),
      Request.get(`/storage/video/${id}`),
      Request.get(`/storage/traditional_ad_banner/${id}`),
      Request.get(`/storage/youtube_thumbnail_banner/${id}`),
      Request.get(`/storage/comics/${id}`),
      Request.get(`/inventory/stored/${id}`),
      Request.postByUrl(`/social_media/generate-email/${id}`)
    ]);
    
    console.log("=== ASSET LOADER RESPONSE DEBUG ===");
    console.log("Input images:", inputImages);
    console.log("Output images:", outputImages);
    console.log("Recommended price:", recommendedPrice);
    console.log("Processing metadata:", processingMetadata);
    console.log("FAQs:", faqs);
    console.log("Story:", story);
    console.log("History:", history);
    console.log("Product style:", productStyle);
    console.log("Product origin:", productOrigin);
    console.log("Predicted artist:", predictedArtist);
    console.log("Product medium:", productMedium);
    console.log("Product themes:", productThemes);
    console.log("Product colors:", productColors);
    console.log("Output videos:", outputVideos);
    console.log("Traditional ad banner:", traditionalAdBanner);
    console.log("YouTube thumbnail banner:", youtubeThumbnailBanner);
    console.log("Comics:", comics);
    console.log("Inventory recommendations:", inventoryRecommendations);
    
    // Safely extract recommendations with fallback
    let recs = [];
    try {
      recs = inventoryRecommendations?.recommendations?.recommendations || [];
      console.log("Extracted recommendations:", recs);
    } catch (error) {
      console.warn("Failed to extract recommendations:", error);
      recs = [];
    }
    
    // Combine into a single object
    const result = {
      inputImages,        // [{ tag, image }]
      outputImages,       // [{ tag, image }]
      recommendedPrice,   // { uid, price }
      processingMetadata, // { status, message, error, processing_time, created_at }
      faqs,               // [{ question, answer }]
      story,              // { uid, story }
      history,            // { uid, location_specific_info, descriptive_history }
      productStyle,       // { id, style }
      productOrigin,      // { id, origin }
      predictedArtist,    // { id, predicted_artist }
      productMedium,      // { id, medium }
      productThemes,      // { id, themes }
      productColors,      // { id, colors }
      outputVideos,
      edited_video: edited_video?.video,
      reel_video: reel_video?.[0]?.video,
      traditionalAdBanner,
      youtubeThumbnailBanner,
      comics,
      recs,
      emailHtml
    };
    
    console.log("=== FINAL ASSET LOADER RESULT ===");
    console.log("Complete result object:", result);
    console.log("=== END ASSET LOADER DEBUG ===");
    
    return result;
  } catch (error) {
    console.error("=== ASSET LOADER ERROR ===");
    console.error("Failed to load metadata:", error);
    console.error("Error details:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("=== END ASSET LOADER ERROR ===");
    throw error; // propagate so caller can handle it
  }
};
