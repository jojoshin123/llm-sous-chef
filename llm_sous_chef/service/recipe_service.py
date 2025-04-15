import re
import requests
from bs4 import BeautifulSoup

from llm_sous_chef.service.recipe_utils.get_video_data import download_video
from llm_sous_chef.service.recipe_utils.get_recipe import get_recipe


def generate_recipe(url: str):
    # Download the video and related metadata
    data = download_video(url)

    # Scrape from related websites
    related_link = check_for_url(data["description"])

    data["relatedLink"] = related_link

    # Send to LLM to construct recipe
    response = get_recipe(data)
    return response


def check_for_url(text: str):
    url_pattern = r"https://[^\s]+"
    match = re.findall(url_pattern, text)
    if match:
        print(f"URL matches found in description: {match}")
        for url in match:
            cleaned_url = url.strip("\n .,;:!?")
            response = requests.get(cleaned_url)
            soup = BeautifulSoup(response.text, "html.parser")
            text = soup.get_text()
            print(text)
            return text

        # TODO: Visit website and pull recipe down

        # soup = BeautifulSoup(response.text, "html.parser")
    # return match

# print("\n\n\nURL check:")
# print(check_for_url(data["description"]))
# print("\n\n\n")