import os
import psycopg

db = os.getenv("PSQL_DB")
user = os.getenv("PSQL_RW_USER")
pwd = os.getenv("PSQL_RW_PWD")
conn = psycopg.connect(
    f"dbname={db} user={user} password={pwd} host=localhost port=5432"
)

# Optional: autocommit mode if you don’t want to manage transactions manually
conn.autocommit = True

# _________ ID fetch helper functions _________

def get_cookbook_id(cur: psycopg.Cursor, cookbook_name: str) -> str:
    cur.execute("""
                            SELECT id from cookbooks
                            WHERE name=%s
                            """,
                (cookbook_name,)
                )
    cookbook_id = cur.fetchone()[0]
    return cookbook_id

def get_cookbook_name(cookbook_id: str, cur=None) -> str:
    if not cur:
        cur = conn.cursor()
    cur.execute("""
                            SELECT name from cookbooks
                            WHERE id=%s
                            """,
                (cookbook_id,)
                )
    cookbook_name = cur.fetchone()[0]
    return cookbook_name

def get_user_tuple(cur: psycopg.Cursor, user_name: str) -> str:
    cur.execute("""
                    SELECT id,hashed_pwd FROM users
                    WHERE username = %s OR email = %s
                    LIMIT 1""",
                (user_name,user_name)
    )
    user_id_tuple = cur.fetchone() # return whole tuple
    return user_id_tuple
