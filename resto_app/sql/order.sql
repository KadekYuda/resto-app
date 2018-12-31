CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS order_item(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	product_id INTEGER,
	amount INTEGER,
    unit_price INTEGER,
    subtotal INTEGER,
    order_id INTEGER,
	FOREIGN KEY(product_id) REFERENCES menu(menu_id),
    FOREIGN KEY(order_id) REFERENCES orders(id)
);