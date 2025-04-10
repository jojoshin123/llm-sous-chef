import bcrypt
from llm_sous_chef.db.db import conn
from psycopg import errors

def get_users():
    with conn.cursor() as cur:
        cur.execute("SELECT id, username, email, hashed_pwd FROM users")
        users = cur.fetchall()
        for user in users:
            print(user)
        return users

def add_users(username: str, email: str, raw_password: str):
    hashed_pwd = hash_password(raw_password)
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        INSERT INTO users (username, email, hashed_pwd)
                        VALUES (%s, %s, %s)
                        RETURNING id""",
            (username, email, hashed_pwd)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            return str(user_id)
    except errors.UniqueViolation:
        conn.rollback()
        return None

# def login(username: str, email: str, raw_password: str) -> bool:

def hash_password(plain_password: str) -> str:
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')  # Store as string in the database

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))