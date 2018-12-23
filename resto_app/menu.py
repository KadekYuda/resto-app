from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from resto_app.auth import login_required
from resto_app.db import get_db

bp = Blueprint('menu', __name__, url_prefix='/menu')

@bp.route('/')
def index():
    db = get_db()
    foods = db.execute(
                'SELECT * FROM menu WHERE type = ?', ('food',)
            ).fetchall()
    
    drinks = db.execute(
                'SELECT * FROM menu WHERE type = ?', ('drink',)
            ).fetchall()
    return render_template('menu/index.html', foods=foods, drinks=drinks)

@bp.route('/<int:id>')
def detail(id):
    db = get_db()
    item = db.execute(
        'SELECT * FROM menu WHERE menu_id = ?', (id,)
    ).fetchone()
    return render_template('menu/detail.html', item=item)

