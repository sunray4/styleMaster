from playwright.sync_api import sync_playwright
import requests

with sync_playwright() as p:

    browser = p.chromium.launch(headless=False)

    page = browser.new_page()

    page.goto('https://www2.hm.com/en_ca/search-results.html?q=shirt')
    page.wait_for_selector("div.bb9826.e89418.ceabfb img")
    image_elements = page.query_selector_all("div.bb9826.e89418.ceabfb img")
    img_urls = []
    for img in image_elements:
        if (img.get_attribute('src') and 'http' in img.get_attribute('src')):
            img_urls.append(img.get_attribute('src'))
    idx = 0
    for url in img_urls:
        open(f"images/image_{idx}.jpg", "wb").write(requests.get(url).content)
        idx += 1
        print(url)
    print(len(img_urls))
    browser.close()


