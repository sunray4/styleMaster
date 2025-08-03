from playwright.sync_api import sync_playwright
import requests
import time
import os

def scrape_images(gender, formality):
    # gender: men/women/all
    # formality: no specification (formality == "none"), formal, casual
    
    # Convert to lowercase for consistency
    gender = gender.lower()
    formality = formality.lower()
    
    print(f"Debug: gender='{gender}', formality='{formality}'")

    for filename in os.listdir('images/tops'):
        file_path = os.path.join('images/tops', filename)
        os.remove(file_path)
    for filename in os.listdir('images/bottoms'):
        file_path = os.path.join('images/bottoms', filename)
        os.remove(file_path)

    try:
        with sync_playwright() as p:

            browser = p.chromium.launch(headless=False)
            context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

            page = context.new_page()
            page.set_extra_http_headers({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
            })
            
            # TOPS
            topLink = ""
            if formality == "casual" and gender == "male":
                topLink = "https://www2.hm.com/en_ca/search-results.html?q=casual&productTypes=Top,T-shirt,Shirt&image=stillLife&department=men_all&sort=RELEVANCE&page=1"
            elif formality == "casual" and gender == "female":
                topLink  = "https://www2.hm.com/en_ca/search-results.html?q=casual&productTypes=Top,T-shirt,Vest,Knit+Sweater,Cardigan&image=stillLife&department=ladies_all&sort=RELEVANCE&page=2"
            elif formality == "casual" and gender == "all":
                topLink = "https://www2.hm.com/en_ca/search-results.html?q=casual&productTypes=Blouse,Cardigan,Knit+Sweater,T-shirt,Top,Vest&image=stillLife&sort=RELEVANCE&page=1"
            elif formality == "formal" and gender == "male":
                topLink = "https://www2.hm.com/en_ca/search-results.html?q=formal&image=stillLife&department=men_all&sort=RELEVANCE&page=1"    
            elif formality == "formal" and gender == "female":
                topLink = "https://www2.hm.com/en_ca/search-results.html?q=formal%20shirt&image=stillLife&department=ladies_all&page=1"
            elif formality == "formal" and gender == "all":
                topLink = "https://www2.hm.com/en_ca/search-results.html?q=formal&productTypes=Blazer,Shirt&customerGroups=Man,Woman&image=stillLife&sort=RELEVANCE&page=1"
            elif formality == "all" and gender == "male":
                topLink = "https://www2.hm.com/en_ca/search-results.html?q=men&productTypes=Blazer,Cardigan,Coat,Jacket,Knit+Sweater,Pajama+Top,Shirt,T-shirt,Top,Vest&image=stillLife&sort=RELEVANCE&page=2"
            elif formality == "all" and gender == "female":
                topLink = "https://www2.hm.com/en_ca/search-results.html?q=women&productTypes=Cardigan,Coat,Jacket,Nightshirt,Pajama+Tank+Top,Pajama+Top,Shirt,T-shirt,Top,Vest&image=stillLife&department=ladies_all&sort=RELEVANCE&page=6"
            elif formality == "all" and gender == "all":
                topLink = "https://www2.hm.com/en_ca/search-results.html?q=top&image=stillLife&department=all&sort=RELEVANCE&page=1"
            
            # no condition matches
            if not topLink:
                print(f"No matching condition found for gender='{gender}', formality='{formality}'")
                topLink = "https://www2.hm.com/en_ca/search-results.html?q=casual&productTypes=Blouse,Cardigan,Knit+Sweater,T-shirt,Top,Vest&image=stillLife&sort=RELEVANCE&page=1"
            
            print(f"Using link: {topLink}")
            page.goto(topLink, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_selector("ul > li")
            for _ in range(5):
                page.mouse.wheel(0, 2000)
                time.sleep(0.00001)
            image_elements = page.query_selector_all("ul > li.is-active")
            img_urls = []
            for item in image_elements:
                img = item.query_selector("img")
                if img:
                    src = img.get_attribute("src")
                    img_urls.append(src)
            idx = 0
            for url in img_urls:
                 open(f"images/tops/tops_{idx}.jpg", "wb").write(requests.get(url).content)
                 idx += 1

            #BOTTOMS
            bottomLink = ""
            if formality == "casual" and gender == "male":
                bottomLink = "https://www2.hm.com/en_ca/search-results.html?q=casual&productTypes=Jeans,Pajama+Pants,Pants,Shorts&image=stillLife&department=men_all&sort=RELEVANCE&page=5"
            elif formality == "casual" and gender == "female":
                bottomLink = "https://www2.hm.com/en_ca/search-results.html?q=casual&productTypes=Jeans,Pajama+Pants,Pants,Shorts,Skirt,Skort,Leggings&image=stillLife&department=ladies_all&sort=RELEVANCE&page=1"
            elif formality == "casual" and gender == "all":
                bottomLink = "https://www2.hm.com/en_ca/search-results.html?q=casual&productTypes=Jeans,Pajama+Pants,Pants,Shorts,Skirt,Skort,Leggings&image=stillLife&department=all&sort=RELEVANCE&page=3"
            elif formality == "formal" and gender == "male":
                bottomLink = "https://www2.hm.com/en_ca/search-results.html?q=formal%20pant&image=stillLife&department=men_all&page=1"
            elif formality == "formal" and gender == "female":
                bottomLink = "https://www2.hm.com/en_ca/search-results.html?q=formal&productTypes=Pants&image=stillLife&department=ladies_all&sort=RELEVANCE&page=1"
            elif formality == "formal" and gender == "all":
                bottomLink = "https://www2.hm.com/en_ca/search-results.html?q=formal&productTypes=Pants&customerGroups=Woman,Man&image=stillLife&department=all&sort=RELEVANCE&page=1"
            elif formality == "all" and gender == "male":
                bottomLink = "https://www2.hm.com/en_ca/search-results.html?q=men&clothingStyles=Tuxedo+Pants,Wide+leg,Trashed,Track+Pants,Tapered,Tailored+Shorts,Sweatshorts,Sweatpants,Suit+Pants,Straight+Leg,Slacks,Pull-on+Pants,Cycling+Shorts,Cargo&image=stillLife&sort=RELEVANCE&page=3"
            elif formality == "all" and gender == "female":
                bottomLink = "https://www2.hm.com/en_ca/search-results.html?q=women&productTypes=Jeans,Leggings,Pajama+Pants,Pants,Shorts,Skirt,Skort,Tights&image=stillLife&sort=RELEVANCE&page=11"
            elif formality == "all" and gender == "all":
                bottomLink = "https://www2.hm.com/en_ca/search-results.html?q=clothes&customerGroups=Woman,Man&productTypes=Jeans,Leggings,Pajama+Pants,Pants,Shorts,Skirt,Skort&image=stillLife&sort=RELEVANCE&page=3"
            
            # no condition matches
            if not bottomLink:
                print(f"No matching condition found for bottoms - gender='{gender}', formality='{formality}'")
                bottomLink = "https://www2.hm.com/en_ca/search-results.html?q=casual&productTypes=Jeans,Pajama+Pants,Pants,Shorts,Skirt,Skort,Leggings&image=stillLife&department=all&sort=RELEVANCE&page=3"
            
            print(f"Using bottoms link: {bottomLink}")
            page.goto(bottomLink)
            page.wait_for_selector("ul > li")
            for _ in range(5):
                page.mouse.wheel(0, 2000)
                time.sleep(0.00001)
            image_elements = page.query_selector_all("ul > li.is-active")
            img_urls = []
            for item in image_elements:
                img = item.query_selector("img")
                if img:
                    src = img.get_attribute("src")
                    img_urls.append(src)
            idx = 0
            for url in img_urls:
                 open(f"images/bottoms/bottoms_{idx}.jpg", "wb").write(requests.get(url).content)
                 idx += 1
            browser.close()
            return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
# scrape_images("women", "casual")