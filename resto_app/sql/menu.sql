CREATE TABLE IF NOT EXISTS menu (
    menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    unit_price INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    UNIQUE(name, description, unit_price, image_url)
);