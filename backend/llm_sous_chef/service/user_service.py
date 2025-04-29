import bcrypt
from psycopg import errors
from llm_sous_chef.db.db import conn, get_user_tuple
from llm_sous_chef.auth import create_jwt

def get_users():
    with conn.cursor() as cur:
        cur.execute("SELECT id, username, email, hashed_pwd FROM users")
        users = cur.fetchall()
        for user in users:
            print(user)
        return users

def add_users(username: str, email: str, raw_password: str):
    hashed_pwd = hash_string(raw_password)
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        INSERT INTO users (username, email, hashed_pwd)
                        VALUES (%s, %s, %s)
                        RETURNING id""",
                        (username, email, hashed_pwd) # TODO: I know I'm storing raw emails into DB .... it's fine
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            return str(user_id)
    except errors.UniqueViolation:
        conn.rollback()
        return None

def login(user: str, raw_password: str) -> dict | None:
    with conn.cursor() as cur:
        row = get_user_tuple(cur, user)
        user_id, username, user_hashed_pwd = row[0],row[1],row[2]
        if verify_hash(raw_password, user_hashed_pwd):
            response = {
                "username": username,
                "token": str(create_jwt({"user_id": user_id, "username": username}))
            }
            return response

# _________ bcrypt helpers _________

def hash_string(plain_string: str) -> str:
    hashed = bcrypt.hashpw(plain_string.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')  # Store as string in the database

def verify_hash(plain_string: str, hashed_string: str) -> bool:
    return bcrypt.checkpw(plain_string.encode('utf-8'), hashed_string.encode('utf-8'))
