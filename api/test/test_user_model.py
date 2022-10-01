import pytest
from datetime import datetime
from app.models import User

def test_to_dict(app):
    with app.app_context():

        user = User.query.filter_by(username="test").first()

        # Testing to_dict method
        data = user.to_dict()
        assert 'id' in data
        assert 'username' in data
        assert 'email' not in data
        assert 'public_id' in data
        assert '_links' in data

        data = user.to_dict(include_email=True)

        assert 'email' in data

def test_from_dict(app):
    with app.app_context():
        user = User.query.filter_by(username="test").first()

         # Testing from_dict method
        user_dict = {
            'username': 'temp',
            'email': 'temp@temp.test'
        }

        assert user.username == 'test'
        assert user.email == 'user@test.com'
        assert user.check_password('test')

        user.from_dict(user_dict)

        assert user.username == 'temp'
        assert user.email == 'temp@temp.test'

        user_dict['password'] = 'other'

        user.from_dict(user_dict, new_user=True)

        assert user.check_password('other')

def test_password(app):
    with app.app_context():
        user = User.query.filter_by(username="test").first()

        user.password = 'changedpassword'
        assert user.password != 'changedpassword'


def test_get_token(app):
    with app.app_context():
        user = User.query.filter_by(username="test").first()

        assert user.token is None
        assert user.token_expiration is None

        token = user.get_token()
        assert user.token == token
        assert user.token_expiration > datetime.utcnow()


def test_revoke_token(app):
    with app.app_context():
        user = User.query.filter_by(username="test").first()

        user.revoke_token()
        assert user.token_expiration < datetime.utcnow()

def test_check_token(app):
    with app.app_context():
        user = User.query.filter_by(username="test").first()
        token = user.get_token()
        user2 = User.check_token(token)

        assert user.username == user2.username
