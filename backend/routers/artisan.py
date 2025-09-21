from fastapi import FastAPI, HTTPException, APIRouter, Form, UploadFile, File
from routers.inventory import recommend_inventory
from services import artisan_client

from uuid import uuid4
from services.storage.storage import parse_response, store_artisan_inputs
from services.social_media.youtube.editor.video_processor import (
    VideoProcessor,
    process_video_with_marketing_audio,
)

from routers.social_media import ad_banner_maker, nanobananas_thumbnail_maker, create_comic 
import logging
from routers.classifier import classify_image
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


processor = VideoProcessor()

router = APIRouter(prefix="/artisan")


@router.post("/generateContent")
async def generate_content(
    artistName: str = Form(""),
    state: str = Form(""),
    artForm: str = Form(""),
    targetRegion: str = Form(""),
    artistDescription: str = Form(""),
    productDescription: str = Form(...),
    language: str = Form("en"),  # Language parameter from frontend
    image: UploadFile = File(...)
):
    try:
        
        uid = uuid4().int & ((1 << 32) - 1)  # clamp to signed 32-bit
        id= int(uid)
        print("id,", id)


        #we store the artisan inputs
        



        if targetRegion == "":
            targetRegion = "GLOBAL"
        ## When we call the classify image we also store the recommended prices
        ## predicted artist etc. 
        logger.info("Starting image classification...")
        classification = await classify_image(id, image)
        logger.info(f"Classification result: {classification}")
        logger.info(f"Available keys in classification: {list(classification.keys())}")
        
        # Reset image file position for subsequent use
        await image.seek(0)
        
        # Check if classification was successful
        if classification.get("status") == "error":
            logger.error(f"Classification failed: {classification.get('message', 'Unknown error')}")
            raise HTTPException(status_code=500, detail=f"Image classification failed: {classification.get('message', 'Unknown error')}")
        
        # Log the classification storage attempt
        logger.info(f"Attempting to store classification data for id {id}")

        state=classification["origin"]
        # we over ride if nothing was provided 
        if artistName == "":
            artistName = classification["artist"]
        if state == "":
            state = classification["state"]
        if artForm == "":
            artForm = classification["style"]

        artTheme=classification["themes"]
        color=classification["color"]


        

        


        #call your inventory api to get the inventory
        
        #store it somewhere

        print("artistName: ", artistName)
        print("state: ", state)
        print("artForm: ", artForm)
        print("targetRegion: ", targetRegion)
        print("artistDescription: ", artistDescription)
        print("productDescription: ", productDescription)
        print("language: ", language)

        # augment the product description with the artist's description
        augmented_description = ""
        augmented_description = f"{augmented_description} the artist's name is {artistName}"
        augmented_description = f"{augmented_description} the art's theme is {artTheme}"
        augmented_description = f"{augmented_description} the artist's state is {state}"
        augmented_description = f"{augmented_description} the artist's art form is {artForm}"
        augmented_description = f"{augmented_description} the artist's target region is {targetRegion}"
        augmented_description = f"{augmented_description} the artist's story is {artistDescription}"
        augmented_description = f"{augmented_description} the color of the artifact is {color}"
        augmented_description += f"{productDescription} {artistDescription}"


        productDescription = augmented_description
        print("productDescription: ", productDescription)


        store_artisan_inputs(
            id,
            1,
            productDescription,
            augmented_description,
            targetRegion,
            "Marketing",
            "en",
            "Authentic, Handmade",
        )
        
        # Add a delay and retry mechanism to ensure database operations are committed
        import asyncio
        from services.storage.storage import get_product_style
        stored_style = get_product_style(id)
        logger.info(f"Stored style for id {id}: {stored_style}")
        
        if not stored_style:
            logger.error(f"No style found for id {id} after classification. This indicates a database persistence issue.")
            raise HTTPException(
                status_code=500, 
                detail="Database persistence issue: Classification data not properly stored"
            )
        
        await recommend_inventory(id)

        # Use the ArtisanOrchestrator to handle the complete workflow
        logger.info("Calling artisan_client.generate_content...")
        try:
            response = await artisan_client.generate_content(
                product_description=productDescription,
                language=language,
                image=image,
                artist_name=artistName,
                state=state,
                art_form=artForm,
                target_region=targetRegion,
                artist_description=artistDescription
            )
            # we need to store this response in the database
            print("response we got is, ", response)
            print("response type:", type(response))
            print("response keys:", list(response.keys()) if isinstance(response, dict) else "Not a dict")

            # we parse the response
            parse_response(id, response)
        except Exception as e:
            logger.error(f"Error in artisan_client.generate_content: {str(e)}")
            logger.error(f"Error type: {type(e)}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise HTTPException(status_code=500, detail=f"Artisan client error: {str(e)}")



        #we need to get comics 
        ad_banner_maker(id)
        nanobananas_thumbnail_maker(id)
        create_comic(id)


        #we save the edited videos also 


        # Check if video exists
        video_blob = processor.get_video_blob(id)
        if not video_blob:
            logger.warning(f"No video found for UID: {id}, continuing without video processing")
        else:
            logger.info(f"Found video blob of size: {len(video_blob)} bytes")

        # Check if story exists
        story = processor.get_product_story(id)
        if not story:
            logger.warning(f"No story found for UID: {id}, continuing without story")
        else:
            logger.info(f"Found story: {story[:100]}...")




        #we call the making of ad banners
        
        # Process the video
        success = await process_video_with_marketing_audio(id)

        if success:
            logger.info("Video processing completed successfully!")
            return {
                "success": True,
                "id": id,
                "message": "Content generated successfully",
                "data": response
            }
        else:
            logger.error("Video processing failed!")
            return {
                "success": False,
                "id": id,
                "message": "Video processing failed",
                "data": response
            }

        
    except Exception as e:
        print(f"Error in generate_content endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Database is now uploaded after each write operation, so no need to upload here
        pass
