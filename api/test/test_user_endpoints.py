import pytest
from datetime import datetime
from app.models import User
import json

def test_get_user_by_id_without_authorization(client):
    response = client.get('/api/users/1')
    assert response.status == '401 UNAUTHORIZED'


def test_get_user_by_id(app, client):
    with app.app_context():
        user = User.query.filter_by(id=1).first()
        token = user.get_token()

        response = client.get(
            f'/api/users/{user.id}',
            headers={ 'Authorization': f'Bearer {token}'}
        )

        assert response.status == '200 OK'


def test_get_users_without_authorization(client):
    response = client.get('/api/users')
    assert response.status == '401 UNAUTHORIZED'


def test_get_users(app, client):
    with app.app_context():
        user = User.query.filter_by(id=1).first()
        token = user.get_token()

        response = client.get(
            '/api/users',
            headers= {'Authorization': f'Bearer {token}'}
        )

        assert response.status == '200 OK'

def test_create_user_with_missing_inputs(app, client):
    with app.app_context():
        response = client.post(
            '/api/users',
            headers={'Content-Type': 'application/json'},
            data={
                'email': 'abc@123.unme',
                'password': 'The Green Brown Fox Jumped Over The Lazy Dog.'
            }
        )

        assert response.status == '400 BAD REQUEST'

        response = client.post(
            '/api/users',
            headers={'Content-Type': 'application/json'},
            data={
                'username': 'abc123',
                'password': 'The Green Brown Fox Jumped Over The Lazy Dog.'
            }
        )

        assert response.status == '400 BAD REQUEST'

        response = client.post(
            '/api/users',
            headers={'Content-Type': 'application/json'},
            data={
                'username': 'abc123',
                'email': 'abc@123.unme'
            }
        )

        assert response.status == '400 BAD REQUEST'

def test_create_user_already_created(app, client):
    with app.app_context():
        response = client.post(
            '/api/users',
            headers={'Content-Type': 'application/json'},
            data={
                'username': 'test',
                'email': 'user@test.com',
                'password': 'The Green Brown Fox Jumped Over The Lazy Dog.'
            }
        )

        assert response.status == '400 BAD REQUEST'


def test_create_user(app, client):
    with app.app_context():
        mimetype = 'application/json'
        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype
        }
        response = client.post(
            '/api/users',
            json={
                "email": "user2@test.com",
                "password": "abc123",
                "first_name": "some",
                "last_name": "body"
            },
            headers=headers
        )

        assert response.status == '201 CREATED'

def test_update_user_without_authorization(app, client):
    with app.app_context():
        mimetype = 'application/json'
        headers = {'Content-Type': mimetype, 'Accept': mimetype}
        response = client.put('/api/users/2',
            json={
                "email": "user@test.com"
            },
            headers=headers
        )

        assert response.status == '401 UNAUTHORIZED'

def test_update_user_not_you(app, client):
    with app.app_context():
        token = User.query.filter_by(id=1).first().get_token()

        mimetype = 'application/json'
        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype,
            'Authorization': f'Bearer {token}'
        }
        response = client.put('/api/users/10',
            json={
                "email": "user@test.com"
            },
            headers=headers
        )

        assert response.status == '403 FORBIDDEN'

def test_update_user_already_created(app, client):
    with app.app_context():
        token = User.query.filter_by(id=1).first().get_token()

        mimetype = 'application/json'
        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype,
            'Authorization': f'Bearer {token}'
        }
        response = client.put('/api/users/1',
            json={
                "email": "other@test.com"
            },
            headers=headers
        )

        assert response.status == '400 BAD REQUEST'


def test_update_user(app, client):
    with app.app_context():
        token = User.query.filter_by(id=1).first().get_token()

        mimetype = 'application/json'
        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype,
            'Authorization': f'Bearer {token}'
        }
        response = client.put('/api/users/1',
            json={
                "email": "someother@test.com"
            },
            headers=headers
        )

        assert response.status == '200 OK'
