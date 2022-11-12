from app.models import Project

def test_get_project_by_id(app, client):
  with app.app_context():
    project = Project.query.filter_by(id=1).first()

    response = client.get(
      f'/api/projects/{project.id}'
    )

    assert response.status == '200 OK'
