import functools
import requests
import json
import re

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

        if name is '':
            error = "Name required."
        elif username is '':
            error = "Username required."
        elif len(password) < 6:
            error = "Password needs to be at least 6 characters long."
        elif address is '':
            error = "Address required."
        elif email is '':
            error = "Email required."
        elif email_invalid(email):
            error = '{} is not a valid email.'.format(email)
        elif len(phone) < 9 or len(phone) > 12:
            error = "Please enter 9 to 12 digits phone number"
        elif db.execute(
           'SELECT id FROM user WHERE username = ?', (username,)
        ).fetchone() is not None:
            error = 'User {} is already registered.'.format(username)
        elif db.execute(
            'SELECT id FROM user WHERE email = ?', (email,)
        ).fetchone() is not None:
            error = 'Email {} is already registered.'.format(email)
        
        if error is None:
            cursor = db.cursor()
            cursor.execute(
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
            last_row_id = cursor.lastrowid
            db.commit()
            session.clear()
            session.permanent = True
            session['user_id'] = last_row_id
            return redirect(url_for('index'))
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
            return redirect(url_for('index'))
        
        flash(error)
    return render_template('auth/login.html')

@bp.route('/validate-username/<string:username>')
def validate_username(username):
    db = get_db()
    user = db.execute('SELECT id FROM user WHERE username = ?', (username,)).fetchone()
    if user is None:
        return json.dumps(True)
    return json.dumps(False)

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

def email_invalid(email):
    pattern = r"^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$"
    return not re.match(pattern, email)


