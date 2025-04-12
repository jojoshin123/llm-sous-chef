import re

from llm_sous_chef.get_video_data import download_video
from llm_sous_chef.get_recipe import get_recipe


def generate_recipe(url: str):
    data = download_video(url)
    response = get_recipe(data)
    return response


def check_for_url(text: str):
    url_pattern = r"https://[^\s]+"
    match = re.search(url_pattern, text)
    if match:
        print(f"URL match found in description: {match}")
        # TODO: Visit website and pull recipe down
    return match

# print("\n\n\nURL check:")
# print(check_for_url(data["description"]))
# print("\n\n\n")