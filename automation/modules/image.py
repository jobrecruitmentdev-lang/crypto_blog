import requests
import base64
from tenacity import retry, stop_after_attempt, wait_exponential
from config import Config, logger
from modules.strapi_client import upload_media

def generate_image_nvidia(topic: str) -> bytes:
    logger.info(f"Generating image for: {topic} (via NVIDIA FLUX.1-dev)")
    if not Config.NVIDIA_API_KEY:
        raise ValueError("No NVIDIA_API_KEY available")
        
    url = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev"
    headers = {
        "Authorization": f"Bearer {Config.NVIDIA_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    payload = {
        "prompt": f"Ultra-realistic, abstract blockchain and crypto network visual style representing these concepts: {topic.replace('|', ', ')}. glowing circuit motifs, network nodes, 8k resolution, highly detailed, visually striking, modern fintech aesthetic. NO photorealistic people, NO real brand imagery."
    }
    
    response = requests.post(url, headers=headers, json=payload, timeout=60)
    response.raise_for_status()
    
    data = response.json()
    b64_data = None
    
    if "image" in data and isinstance(data["image"], str):
        b64_data = data["image"]
    elif "b64_json" in data and isinstance(data["b64_json"], str):
        b64_data = data["b64_json"]
    elif "artifacts" in data and len(data["artifacts"]) > 0:
        b64_data = data["artifacts"][0].get("base64")
    elif "data" in data and len(data["data"]) > 0:
        b64_data = data["data"][0].get("b64_json") or data["data"][0].get("image") or data["data"][0].get("base64")
        
    if not b64_data:
        logger.error(f"NVIDIA API responded with unknown JSON shape. Keys: {list(data.keys())}")
        raise ValueError("Missing image data in NVIDIA API response")
        
    if b64_data.startswith("data:image"):
        b64_data = b64_data.split(",", 1)[1]
        
    return base64.b64decode(b64_data)

def generate_image_huggingface(topic: str) -> bytes:
    logger.info(f"Generating image for: {topic} (via Hugging Face FLUX.1-schnell)")
    if not Config.HUGGINGFACE_API_KEY:
        raise ValueError("No HUGGINGFACE_API_KEY available")
        
    headers = {"Authorization": f"Bearer {Config.HUGGINGFACE_API_KEY}"}
    payload = {"inputs": f"Ultra-realistic, abstract blockchain and crypto network visual style representing these concepts: {topic.replace('|', ', ')}. glowing circuit motifs, network nodes, 8k resolution, highly detailed, visually striking, modern fintech aesthetic. NO photorealistic people, NO real brand imagery."}
    
    api_url = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell"
    response = requests.post(api_url, headers=headers, json=payload, timeout=60)
    response.raise_for_status()
    
    return response.content

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def generate_and_upload_image(topic: str, slug: str = None):
    image_bytes = None
    
    try:
        image_bytes = generate_image_nvidia(topic)
        logger.info("NVIDIA image generation succeeded.")
    except Exception as e:
        logger.warning(f"NVIDIA image generation failed: {e}. Falling back to Hugging Face...")
        try:
            image_bytes = generate_image_huggingface(topic)
            logger.info("Hugging Face image generation succeeded.")
        except Exception as e2:
            logger.error(f"Hugging Face fallback also failed: {e2}")
            
    if not image_bytes:
        logger.warning("No image generated. Proceeding without featured image.")
        return None
        
    logger.info("Uploading image to Strapi server...")
    
    if image_bytes.startswith(b'\xff\xd8\xff'):
        ext = 'jpg'
        mime = 'image/jpeg'
    elif image_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
        ext = 'png'
        mime = 'image/png'
    elif image_bytes.startswith(b'RIFF') and image_bytes[8:12] == b'WEBP':
        ext = 'webp'
        mime = 'image/webp'
    else:
        ext = 'png'
        mime = 'image/png'
        
    filename = f'{slug}.{ext}' if slug else f'featured_image.{ext}'
    
    media_id = upload_media(image_bytes, filename, mime)
    if media_id:
        logger.info(f"Image uploaded, media id: {media_id}")
    else:
        logger.error("Failed to upload image.")
        
    return media_id
