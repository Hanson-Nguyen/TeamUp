from app.models import Project, User

def test_get_project_by_id(app, client):
  with app.app_context():
    user = User.query.filter_by(id=1).first()
    token = user.get_token()

    project = Project.query.filter_by(id=1).first()

    response = client.get(
      f'/api/projects/{project.id}',
      headers={ 'Authorization': f'Bearer {token}'}
    )

    assert response.status == '200 OK'
