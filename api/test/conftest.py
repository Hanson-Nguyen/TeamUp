from datetime import datetime

import pytest
import uuid
from werkzeug.security import generate_password_hash

from app import create_app
from app import db
from app import init_db
from app.models import User

_user1_pass = generate_password_hash("test")
_user2_pass = generate_password_hash("other")

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # create the app with common test config
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SERVER_NAME": "localhost",
        "APPLICATION_ROOT": "/"
    })

    # create the database and load test data
    # set _password to pre-generated hashes, since hashing for each test is slow
    with app.app_context():
        init_db()

        db.session.add_all(
            (
                User(username="test", _password=_user1_pass, email="user@test.com", public_id=str(uuid.uuid4())),
                User(username="other", _password=_user2_pass, email="other@test.com", public_id=str(uuid.uuid4())),
            )
        )

        db.session.commit()

    yield app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()
