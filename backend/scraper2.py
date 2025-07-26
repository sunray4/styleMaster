from playwright.sync_api import sync_playwright
import requests
import time
with sync_playwright() as p:

    browser = p.chromium.launch(headless=False)

    page = browser.new_page()

    page.goto('https://www2.hm.com/en_ca/search-results.html?q=casual%20bottom&image=stillLife&department=ladies_all&sort=RELEVANCE&page=2')
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
        open(f"images/women-casual-bottom-page2_{idx}.jpg", "wb").write(requests.get(url).content)
        print(url)
        idx += 1
    browser.close()
