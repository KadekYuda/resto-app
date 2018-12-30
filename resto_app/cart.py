import json

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from resto_app.auth import login_required
from resto_app.db import get_db

bp = Blueprint('cart', __name__, url_prefix="/cart")

@bp.route('/')
@login_required
def index():
    db = get_db()
    cart_items = db.execute(
        'SELECT name, amount, unit_price, amount*unit_price AS total_price, image_url FROM cart JOIN menu ON cart.product_id = menu.menu_id WHERE user_id = ?', (g.user["id"],)
    ).fetchall()
    return render_template('cart/index.html', cart_items=cart_items)

@bp.route('/add', methods=["POST"])
@login_required
def add():
    data = request.get_json()
    product_id = data["menu_id"]
    user_id = data["user_id"]
    amount = data["amount"]
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO cart(product_id, user_id, amount) VALUES(?, ? , ?) ON CONFLICT(product_id, user_id) DO UPDATE SET amount = amount + ?', (product_id, user_id, amount, amount,)
    )
    db.commit()
    return json.dumps(True)


