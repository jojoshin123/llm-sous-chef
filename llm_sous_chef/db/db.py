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