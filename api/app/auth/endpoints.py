from flask import Blueprint, request, make_response, jsonify, current_app
from flask_api import status
from app import db
from app.auth.models import User
import jwt
import uuid
import datetime

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route("/login", methods=['POST'])
def login():
    """Log in a registered user by and sendback Jwt"""
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return make_response("Unauthorized", status.HTTP_401_UNAUTHORIZED)

    user = User.query.filter_by(name=auth.username).first()

    if user.check_password(auth.password):
        token = jwt.encode(jwt.encode({'public_id' : user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=45)}, current_app.config['SECRET_KEY'], "HS256"))

        return jsonify({'token': token})

    return make_response("Unauthorized", status.HTTP_401_UNAUTHORIZED)

@bp.route("/register", methods=['POST'])
def register():
    error = None
    username = request.form['username']
    password = request.form['password']

    if not username:
        error = "Username is required."
    elif not password:
        error = "Password is required"
    elif db.session.query(User.query.filter_by(username=username).exists()).scalar():
        error = f"User {username} is already registered"

    if error is None:
        # the name is available, create the user
        new_user = User(public_id=str(uuid.uuid4()), username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return make_response("Created", status.HTTP_201_CREATED)

    return make_response("Not Acceptable", status.HTTP_406_NOT_ACCEPTABLE)
