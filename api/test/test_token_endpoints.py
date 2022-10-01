import pytest
import base64
from app.models import User

def test_get_token(app, client):
    with app.app_context():
        message_bytes = 'test:test'.encode('ascii')
        base64_bytes = base64.b64encode(message_bytes)
        credentials = base64_bytes.decode('ascii')

        response = client.post(
            'api/tokens',
            headers={
                'Authorization': f'Basic {credentials}'
            },
            data={}
        )

        assert response.status == '200 OK'

def test_get_token_unauthorized(app, client):
    with app.app_context():
        response = client.post('api/tokens')
        assert response.status == '401 UNAUTHORIZED'

def test_revoke_token(app, client):
    with app.app_context():
        token = User.query.filter_by(username="test").first().get_token()
        response = client.delete(
            'api/tokens',
            headers={'Authorization': f'Bearer {token}'}
        )

        assert response.status == '204 NO CONTENT'

        response = client.delete(
            'api/tokens',
            headers={'Authorization': f'Bearer {token}'}
        )

        assert response.status == '401 UNAUTHORIZED'
