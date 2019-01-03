from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from resto_app.auth import login_required, admin_required
from resto_app.db import get_db

bp = Blueprint('admin', __name__, url_prefix="/admin")

@bp.route('/')
@admin_required
def index():
    return render_template('admin/index.html')