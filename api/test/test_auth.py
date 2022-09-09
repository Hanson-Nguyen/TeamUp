import pytest

from app.auth.models import User

def test_register(client, app):
    response = client.post('/auth/register', data={"username": "a", "password": "a"})

    with app.app_context():
        assert User.query.filter_by(username="a").first() is not None


def test_user_password(app):
    user = User(username="a", password="a")
    assert user.password != "a"
    assert user.check_password("a")

@pytest.mark.parametrize(
    ("username","password", "message"),
    (
        ("","", b"Not Acceptable"),
        ("a", "", b"Not Acceptable"),
        ("test", "test", b"Not Acceptable")
    )
)
def test_register_validate_input(client, username, password, message):
    response = client.post(
        "/auth/register", data={"username":username, "password":password}
    )

    assert message in response.data


@pytest.mark.parametrize(
    ("username", "password", "message"),
    (("a", "test", b'Unauthorized'), ("test", "a", b'Unauthorized')),
)
def test_login_validate_input(auth, username, password, message):
    response = auth.login(username, password)

    print(response.data)
    assert message in response.data
