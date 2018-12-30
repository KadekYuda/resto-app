CREATE TABLE IF NOT EXISTS cart(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	product_id INTEGER,
    user_id INTEGER,
	amount INTEGER,
	FOREIGN KEY(product_id) REFERENCES menu(menu_id),
    FOREIGN KEY(user_id) REFERENCES user(id),
    UNIQUE (product_id, user_id)
);