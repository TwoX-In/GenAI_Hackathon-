import { Request } from "@/request/request";

export const ProductLoader = async (params) => {
  try {
    let id = params.params.id;

    // Fetch all endpoints in parallel - same as MetadataLoader but for individual product
    let [
      inputImages,
      outputImages,
      recommendedPrice,
      processingMetadata,
      faqs,
      story,
      history,
      // productTitle,
      productStyle,
      productOrigin,
      predictedArtist,
      productMedium,
      productThemes,
      productColors,
      edited_video,
      reel_video,
      traditionalAdBanner,
      youtubeThumbnailBanner,
      comics
    ] = await Promise.all([
      Request.get(`/storage/input_images/${id}`).catch(() => []),
      Request.get(`/storage/output_images/${id}`).catch(() => []),
      Request.get(`/storage/recommended_price/${id}`).catch(() => ({ price: 0 })),
      Request.get(`/storage/processing_metadata/${id}`).catch(() => ({})),
      Request.get(`/storage/faqs/${id}`).catch(() => []),
      Request.get(`/storage/story/${id}`).catch(() => ({ story: "" })),
      Request.get(`/storage/history/${id}`).catch(() => ({ location_specific_info: "", descriptive_history: "" })),
      // Request.get(`/storage/title/${id}`).catch(() => ({ title: "Handcrafted Artisan Product" })),
      Request.get(`/storage/style/${id}`).catch(() => ({ style: "" })),
      Request.get(`/storage/origin/${id}`).catch(() => ({ origin: "" })),
      Request.get(`/storage/predicted_artist/${id}`).catch(() => ({ predicted_artist: "" })),
      Request.get(`/storage/medium/${id}`).catch(() => ({ medium: "" })),
      Request.get(`/storage/themes/${id}`).catch(() => ({ themes: "" })),
      Request.get(`/storage/colors/${id}`).catch(() => ({ colors: "" })),
      Request.get(`/storage/edited_video/${id}`).catch(() => null),
      Request.get(`/storage/video/${id}`).catch(() => null),
      Request.get(`/storage/traditional_ad_banner/${id}`).catch(() => null),
      Request.get(`/storage/youtube_thumbnail_banner/${id}`).catch(() => null),
      Request.get(`/storage/comics/${id}`).catch(() => null)
    ]);
    let productTitle = productStyle + " from " + productOrigin +" by " + predictedArtist;
    // Transform output images to match expected format
    const transformedOutputImages = outputImages.map(img => ({
      ...img,
      bytes: img.image // BrutalistBeforeAfter expects 'bytes' property
    }));
    let res1 = await Request.postByUrl("/highlight/text", { text: history.location_specific_info });
    let res2 = await Request.postByUrl("/highlight/text", { text: history.descriptive_history });
    history["highlightedLocationText"] = res1;
    history["highlightedStoryText"] = res2;       
    let videoData=[];
    videoData.push(edited_video["video"])
    videoData.push(reel_video[0]["video"])
    
    let videos=videoData;
    
    // Combine into a single object matching the asset_gen structure
    return {
      inputImages,        // [{ tag, image }]
      outputImages: transformedOutputImages,       // [{ tag, image, bytes }]
      recommendedPrice,   // { uid, price }
      processingMetadata, // { status, message, error, processing_time, created_at }
      faqs,               // [{ question, answer }]
      story,              // { uid, story }
      history,            // { uid, location_specific_info, descriptive_history }
      productTitle,       // { id, title }
      productStyle,       // { id, style }
      productOrigin,      // { id, origin }
      predictedArtist,    // { id, predicted_artist }
      productMedium,      // { id, medium }
      productThemes,      // { id, themes }
      productColors,      // { id, colors }
      edited_video: edited_video?.video,
      reel_video: reel_video?.[0]?.video,
      traditionalAdBanner: traditionalAdBanner,
      youtubeThumbnailBanner: youtubeThumbnailBanner,
      comics: comics,
      videos            // video data
    };
  } catch (error) {
    console.error("Failed to load product data:", error);
    throw error; // propagate so caller can handle it
  }
};