import pytest
from datetime import datetime
from app.models import PaginatedMixin
from app.models import User

def test_pagination_response(app):
    with app.app_context():
        data = PaginatedMixin.to_collection_dict(User.query,1,10, False, 'api.get_users')

        assert 'items' in data
        assert '_meta' in data
        assert '_links' in data
