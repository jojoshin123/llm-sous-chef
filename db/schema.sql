CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    hashed_pwd TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY, -- primary key will be URL?
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cookbook_id INTEGER REFERENCES cookbooks(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cookbooks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cookbook_user_map (
    PRIMARY KEY (user_id, cookbook_id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    cookbook_id INTEGER NOT NULL REFERENCES cookbooks(id)
);

--GRANT USAGE, SELECT ON SEQUENCE cookbook_id_seq, users_id_seq TO <username>;
