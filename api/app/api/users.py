import random as rand
from app.api import bp
from flask import abort
from app import db
from app.models import User, Tag
from flask import jsonify
from flask import request
from flask import url_for
from app.api.errors import bad_request
from app.api.auth import token_auth


@bp.route('/users/<int:id>', methods=['GET'])
@token_auth.login_required
def get_user(id):
    return jsonify(User.query.get_or_404(id).to_dict())


@bp.route('/users', methods=['GET'])
@token_auth.login_required
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    include = 'include' in request.args
    data = User.to_collection_dict(User.query, page, per_page, include, 'api.get_users')
    return jsonify(data)


@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}

    if 'email' not in data or 'password' not in data:
        return bad_request()

    if User.query.filter_by(email=data['email']).first():
        return bad_request()

    user = User()
    user.from_dict(data, new_user=True)

    db.session.add(user)
    db.session.commit()

    response = jsonify(user.to_dict())
    response.status_code = 201
    response.headers['Location'] = url_for('api.get_user', id=user.id)
    return response

@bp.route('/users/tag', methods=['POST'])
@token_auth.login_required
def tag_user():
    data = request.get_json() or {}
    user = token_auth.current_user()

    user.skip_q = True
    id=rand.randint(1, 3)
    tag = Tag.query.filter_by(id=id).first()

    user._tags.append(tag)

    db.session.commit()

    return '', 204


@bp.route('/me/info', methods=['GET'])
@token_auth.login_required
def get_current_user():
    user = token_auth.current_user()

    return jsonify(user.to_dict(True))

@bp.route('/users/<int:id>', methods=['PUT'])
@token_auth.login_required
def update_user(id):
    if token_auth.current_user().id == id:
        abort(403)

    user = User.query.get_or_404(id)
    data = request.get_json() or {}

    if 'email' in data and data['email'] != user.email \
            and User.query.filter_by(email=data['email']).first():
        return bad_request()

    user.from_dict(data, new_user=False)

    db.session.commit()

    return jsonify(user.to_dict())


@bp.route('/users/<int:id>', methods=['DELETE'])
@token_auth.login_required
def delete_user(id):
    User.query.filter_by(id=id).delete()

    db.session.commit()

    return '', 204
