import json
import re

import psycopg
import cfscrape
from bs4 import BeautifulSoup

from llm_sous_chef.service.recipe_utils.get_video_data import download_video
from llm_sous_chef.service.recipe_utils.get_recipe import get_recipe
from llm_sous_chef.db.db import conn


def generate_recipe(url: str):
    # Download the video and related metadata
    data = download_video(url)

    # Scrape from related websites
    related_link = check_for_url(data["description"])

    data["relatedLink"] = related_link

    # Send to LLM to construct recipe
    response = get_recipe(data, url)
    return response


def check_for_url(text: str):
    url_pattern = r"https://[^\s]+"
    match = re.findall(url_pattern, text)
    if match:
        print(f"URL matches found in description: {match}")
        for url in match:
            cleaned_url = url.strip("\n .,;:!?")
            scraper = cfscrape.create_scraper()
            raw_text = scraper.get(cleaned_url).text
            soup = BeautifulSoup(raw_text, "html.parser")
            text = soup.get_text()
            return text

def create_cookbook(user_id: str, cookbook_name: str) -> str:
    with conn.cursor() as cur:
        try:
            cur.execute("""
                        INSERT INTO cookbooks (name, user_id)
                        VALUES (%s, %s)
                        RETURNING id""",
                    (cookbook_name,user_id)
            )
            cookbook_id = cur.fetchone()[0]
            cur.execute("""
                        INSERT INTO cookbook_user_map (user_id, cookbook_id)
                        VALUES (%s, %s)
                        RETURNING cookbook_id""",
                (user_id, cookbook_id)
            )
            conn.commit()
        except Exception as e:
            conn.rollback()
            print("Error creating cookbook:", e)
            cookbook_id = None
        return cookbook_id

def add_recipe_to_cookbook(user_id: str, cookbook_name: str, recipe: dict, url: str) -> str:
    # TODO: Do I need to check if there is a user->cookbook mapping?
    with conn.cursor() as cur:
        cookbook_id = get_cookbook_id(cur, cookbook_name)
        recipe_bytes = json.dumps(recipe).encode('utf-8')
        try:
            cur.execute("""
                        INSERT INTO recipes (url, recipe, user_id, cookbook_id)
                        VALUES (%s, %s, %s, %s)
                        RETURNING id
                        """,
                    (url, recipe_bytes, user_id, cookbook_id)
            )
            recipe_id = cur.fetchone()[0]
            conn.commit()
        except Exception as e:
            conn.rollback()
            print("Error creating recipe:", e)
            recipe_id = None
        return recipe_id

# Returns all recipes in cookbook
def get_cookbook(cookbook_name: str) -> list[dict]:
    # TODO: Do I need to check if there is a user->cookbook mapping?
    with conn.cursor() as cur:
        try:
            cookbook_id = get_cookbook_id(cur, cookbook_name)
            cur.execute("""
                            SELECT recipe from recipes
                            WHERE cookbook_id=%s
                            """,
            (cookbook_id,)
            )
            recipe_tuples = cur.fetchall()
            recipes = [tup[0].decode('utf-8') for tup in recipe_tuples]

            return recipes
        except Exception as e:
            print("Error fetching cookbook:", e)
            recipes = []
        return recipes


# Helper functions

def get_cookbook_id(cur: psycopg.Cursor, cookbook_name: str) -> str:
    cur.execute("""
                            SELECT id from cookbooks
                            WHERE name=%s
                            """,
                (cookbook_name,)
                )
    cookbook_id = cur.fetchone()[0]
    return cookbook_id