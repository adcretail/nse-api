import os
import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Constants
EQUITY_DETAILS_URL = "http://localhost:5000/equity-details"
INPUT_DIR = "proven-stocks"  # Directory containing JSON files
OUTPUT_DIR = "selected_stocks"  # Directory to store fetched equity details
os.makedirs(OUTPUT_DIR, exist_ok=True)  # Create output directory if it doesn't exist

# Function to create Selenium WebDriver instance
def create_webdriver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(
        service=ChromeService(ChromeDriverManager().install()), options=chrome_options
    )
    print("WebDriver initialized.")
    return driver

# Function to fetch and save equity details as JSON files
def fetch_and_store_equity_details(symbol, driver):
    try:
        equity_details_url = f"{EQUITY_DETAILS_URL}?symbol={symbol}"
        print(f"Fetching equity details for {symbol} from {equity_details_url}")
        driver.get(equity_details_url)
        time.sleep(1)  # Wait for the page to load

        soup = BeautifulSoup(driver.page_source, "html.parser")
        pre = soup.find("pre")

        if pre:
            equity_details = json.loads(pre.text)

            # Define the JSON file path
            file_path = os.path.join(OUTPUT_DIR, f"{symbol}.json")

            # Write the fetched details to a JSON file
            with open(file_path, "w") as json_file:
                json.dump(equity_details, json_file, indent=4)
            print(f"Data for {symbol} saved to {file_path}.")
        else:
            print(f"No data found for symbol: {symbol}.")
    except Exception as e:
        print(f"Error fetching or saving data for {symbol}: {e}")

# Main function to fetch symbols from file names and their equity details
def main():
    driver = create_webdriver()

    try:
        # List all JSON files in the input directory
        json_files = [f for f in os.listdir(INPUT_DIR) if f.endswith(".json")]

        # Extract symbols from file names (strip .json extension)
        symbols = [os.path.splitext(file_name)[0] for file_name in json_files]

        print(f"Symbols to fetch: {symbols}")

        # Fetch and save equity details for each symbol
        print("Starting to fetch and save equity details for each symbol...")
        for symbol in symbols:
            fetch_and_store_equity_details(symbol, driver)

        print("Data fetching and saving completed successfully.")

    finally:
        driver.quit()
        print("WebDriver closed.")

if __name__ == "__main__":
    main()
