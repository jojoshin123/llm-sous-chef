import json
import re
import cfscrape
from bs4 import BeautifulSoup

from llm_sous_chef.service.recipe_utils.get_video_data import download_video
from llm_sous_chef.service.recipe_utils.get_recipe import get_recipe
from llm_sous_chef.db.db import conn, get_user_tuple


def generate_recipe(url: str):
    # Download the video and related metadata
    data = download_video(url)

    # Scrape from related websites
    related_link = check_for_url(data["description"])

    data["relatedLink"] = related_link

    # Send to LLM to construct recipe
    response = get_recipe(data, url)
    json_response = json.loads(response)
    if not json_response["ingredients"] or not json_response["instructions"]:
        return None
    return json_response


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

def add_recipe_to_cookbook(user_id: str, cookbook_id: str, recipe: dict, url: str) -> str:
    with conn.cursor() as cur:
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

def get_cookbooks(user_id: str) -> list[dict]:
    with conn.cursor() as cur:
        try:
            cur.execute("""
                            SELECT cookbook_id from cookbook_user_map
                            WHERE user_id=%s
                            """,
                (user_id,)
            )
            cookbook_ids = [tup[0] for tup in cur.fetchall()]
            #
            # cur.execute("""
            #                 SELECT id,name from cookbooks
            #                 WHERE id=ANY(%s)
            #                 """,
            #     (cookbook_ids,)
            # )
            # tuples = cur.fetchall()
            # cookbook_name_map = {cookbook_id: name for cookbook_id, name in tuples}

            # Get Recipe counts
            # (The SELECT statement dictates the final output of id, name, recipe_count)
            cur.execute("""
                            SELECT cookbooks.id AS cookbook_id, cookbooks.name, COUNT(recipes.id) AS recipe_count
                            FROM cookbooks
                            LEFT JOIN recipes ON cookbooks.id = recipes.cookbook_id
                            WHERE cookbooks.id = ANY(%s)
                            GROUP BY cookbooks.id, cookbooks.name;
                            """,
                (cookbook_ids,)
            )
            cookbook_tuples = cur.fetchall()
            cookbooks = [{
                "id": tup[0],
                "name": tup[1],
                "recipe_count": tup[2]
            } for tup in cookbook_tuples]

        except Exception as e:
            print("Error sharing cookbook with new user:", e)
            cookbooks = []
        return cookbooks

# Returns all recipes in cookbook
def get_recipes_in_cookbook(cookbook_id: str) -> list[dict]:
    with conn.cursor() as cur:
        try:
            cur.execute("""
                            SELECT id, recipe from recipes
                            WHERE cookbook_id=%s
                            """,
            (cookbook_id,)
            )
            recipe_tuples = cur.fetchall()
            recipes = [{
                "id": tup[0],
                **json.loads(tup[1].decode('utf-8'))
            } for tup in recipe_tuples]

            return recipes
        except Exception as e:
            print("Error fetching cookbook:", e)
            recipes = []
        return recipes

def delete_recipe_from_cookbook(cookbook_id: str, recipe_id: str) -> int:
    with conn.cursor() as cur:
        try:
            cur.execute("""
                            DELETE FROM recipes
                            WHERE id=%s AND cookbook_id=%s
                            """,
                (recipe_id, cookbook_id)
            )
            rows_deleted = cur.rowcount
            conn.commit()
            return rows_deleted
        except Exception as e:
            conn.rollback()
            print("Error deleting recipe:", e)
            return -1

def share_cookbook(cookbook_id: str, new_user: str) -> str:
    with conn.cursor() as cur:
        try:
            new_user_id = get_user_tuple(cur, new_user)[0]
            cur.execute("""
                            INSERT INTO cookbook_user_map (user_id, cookbook_id)
                            VALUES (%s, %s)
                            RETURNING user_id, cookbook_id
                            """,
                (new_user_id, cookbook_id)
            )
            mapping = cur.fetchall()[0]
        except Exception as e:
            print("Error sharing cookbook with new user:", e)
            mapping = None
        return mapping
