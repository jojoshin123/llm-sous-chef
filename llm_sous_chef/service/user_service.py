import bcrypt
from llm_sous_chef.db.db import conn
from llm_sous_chef.auth import create_jwt
from psycopg import errors

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

def login(user: str, raw_password: str) -> str | None:
    with conn.cursor() as cur:
        cur.execute("""
            SELECT hashed_pwd FROM users
            WHERE username = %s OR email = %s
            LIMIT 1
        """, (user, user))
        user_hashed_pwd = cur.fetchone()[0]
        if verify_hash(raw_password, user_hashed_pwd):
            return create_jwt({"user": user})

# _________ bcrypt helpers _________

def hash_string(plain_string: str) -> str:
    hashed = bcrypt.hashpw(plain_string.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')  # Store as string in the database

def verify_hash(plain_string: str, hashed_string: str) -> bool:
    return bcrypt.checkpw(plain_string.encode('utf-8'), hashed_string.encode('utf-8'))



