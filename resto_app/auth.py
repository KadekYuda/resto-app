import functools

from datetime import timedelta

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from resto_app.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        name = request.form['name']
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        address = request.form['address']
        phone = request.form['phone']
        image_url = url_for('static', filename='img/default.png')
        role = 'customer'

        db = get_db()
        error = None

        # TODO: Ubah pengecekan ke Javascript
        if name is None:
            error = "Name required."
        elif username is None:
            error = "Username required."
        elif password is None:
            error = "Password required."
        elif address is None:
            error = "Address required."
        elif email is None:
            error = "Email required."
        elif phone is None:
            error = "Phone number required."
        # pengecekan yang dipindah ke Javascript sampai sini aja
        elif db.execute(
           'SELECT id FROM user WHERE username = ?', (username,)
        ).fetchone() is not None:
            error = 'User {} is already registered.'.format(username)
        
        if error is None:
            db.execute(
                'INSERT INTO user(name, username, password, email, address, phone, image_url, role) '
                ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                (
                    name,
                    username,
                    generate_password_hash(password),
                    email,
                    address,
                    phone,
                    image_url,
                    role
                )
            )
            db.commit()
            flash("New user successfully created!")
            return redirect(url_for('auth.login'))
        flash(error)
    return render_template('auth/register.html')

@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        db = get_db()
        error = None

        user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()

        if user is None or not check_password_hash(user['password'], password):
            error = 'Incorrect username or password.'
        
        if error is None:
            session.clear()
            session.permanent = True
            session['user_id'] = user['id']
            # TODO: cek role, beda redirect untuk user dan admin
            return redirect(url_for('index'))
        
        flash(error)
    return render_template('auth/login.html')

@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view



