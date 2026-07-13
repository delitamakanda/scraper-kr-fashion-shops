from selenium import webdriver


def build_chrome_driver(*, headless=True) -> webdriver.Chrome:
    options = webdriver.ChromeOptions()
    
    if headless:
        options.add_argument("--headless")
    
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    return webdriver.Chrome(options=options)
