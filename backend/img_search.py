import os
import requests
from dotenv import load_dotenv
from serpapi import GoogleSearch

load_dotenv()

IMGBB_KEY = os.getenv('IMGBB_KEY')
SERPAPI_KEY = os.getenv('SERPAPI_KEY')

def img_search(image_url):
    print(f"Starting image search for URL: {image_url}")
    print(f"SERPAPI_KEY available: {SERPAPI_KEY is not None}")
    
    if not SERPAPI_KEY:
        print("ERROR: SERPAPI_KEY is not set!")
        return None
    
    if not image_url:
        print("ERROR: No image URL provided!")
        return None
    
    try:
        url = "https://serpapi.com/search?engine=google_lens"
        params = {
            "engine": "google_lens",
            "url": image_url,
            "api_key": SERPAPI_KEY
        }
        
        print(f"Making request to SerpAPI with params: {params}")
        # response = requests.get(url, params=params)
        response = GoogleSearch(params)
        results = response.get_dict()
        
        matches = results.get('visual_matches', [])

        if matches:
            first_match = matches[0]
            print(f"First match: {first_match}")
            link = first_match.get("link")
            return link
        else:
            return None
            
    except Exception as e:
        print(f"ERROR in img_search: {str(e)}")
        return None