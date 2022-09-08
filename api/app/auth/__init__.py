from .endpoints import bp
from .models import User
from flask import request, jsonify, current_app
from functools import wraps
import jwt

def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):
       token = None
       if 'x-access-tokens' in request.headers:
           token = request.headers['x-access-tokens']

       if not token:
           return jsonify({'message': 'a valid token is missing'})
       try:
           data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
           current_user = User.query.filter_by(public_id=data['public_id']).first()
       except:
           return jsonify({'message': 'token is invalid'})

       return f(current_user, *args, **kwargs)
#    return decorator
