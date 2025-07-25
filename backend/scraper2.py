from playwright.sync_api import sync_playwright
import requests

with sync_playwright() as p:

    browser = p.chromium.launch(headless=False)

    page = browser.new_page()

    page.goto('https://www2.hm.com/en_ca/search-results.html?q=shirt')
    page.wait_for_selector("ul > li")
    image_elements = page.query_selector_all("ul > li")
    img_urls = []
    for item in image_elements:
        first_img = item.query_selector("img")
        if first_img:
            src = first_img.get_attribute("src")
            if src and src.startswith("http"):
                img_urls.append(src)
    for url in img_urls:
        print(url)
    print(len(img_urls))
    browser.close()


