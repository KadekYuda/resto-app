import json
import pprint


from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from resto_app.auth import login_required
from resto_app.db import get_db

bp = Blueprint('order', __name__, url_prefix='/order')

@bp.route('/', methods=["POST"])
@login_required
def order():
    data = request.get_json()
    user_id = data["user_id"]
    if user_id == g.user["id"]:
        db = get_db()
        # get all of the cart items of user
        cart_items = db.execute(
            'SELECT menu_id, amount, unit_price, amount*unit_price AS subtotal_price FROM cart JOIN menu ON cart.product_id = menu.menu_id WHERE user_id = ?', (g.user["id"],)
        ).fetchall()
        cart_data = []
        total = 0
        for items in cart_items:
            item = {}
            item["menu_id"] = items["menu_id"]
            item["amount"] = items["amount"]
            item["unit_price"] = items["unit_price"]
            item["subtotal_price"] = items["subtotal_price"]
            total += items["subtotal_price"]
            cart_data.append(item)
        # insert order
        cursor = db.cursor()
        cursor.execute(
            'INSERT INTO orders(user_id, total) VALUES(?, ?)', (g.user["id"], total,)
        )
        last_row_id = cursor.lastrowid
        print("Last row id: " + str(last_row_id))
        # insert order items
        for item in cart_data:
            cursor.execute(
                'INSERT INTO order_item(product_id, amount, unit_price, subtotal, order_id) VALUES(?, ?, ?, ?, ?)', 
                (item["menu_id"], item["amount"], item["unit_price"], item["subtotal_price"], last_row_id,)
            )
        # delete from cart
        cursor.execute('DELETE FROM cart WHERE user_id = ?', (g.user["id"],))
        db.commit()
        return json.dumps(True)
    return json.dumps(False)
    