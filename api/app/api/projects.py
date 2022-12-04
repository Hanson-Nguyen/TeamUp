from app.api import bp
from flask import abort
from app import db
from app.models import Project
from flask import jsonify
from flask import request
from flask import url_for
from app.api.errors import bad_request
from app.api.auth import token_auth


@bp.route('/projects/<int:id>', methods=['GET'])
@token_auth.login_required
def get_project(id):
    include = 'include' in request.args
    return jsonify(Project.query.get_or_404(id).to_dict(include))


@bp.route('/projects', methods=['GET'])
@token_auth.login_required
def get_projects():
    page = request.args.get('page', 1, type=int)
    include = 'include' in request.args
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = Project.to_collection_dict(
        Project.query, page, per_page, include, 'api.get_projects')
    return jsonify(data)


@bp.route('/projects', methods=['POST'])
@token_auth.login_required
def create_project():
    data = request.get_json() or {}

    if 'name' not in data or 'size' not in data:
        return bad_request()

    project = Project()

    try:
        project.from_dict(data, new_project=True)

        db.session.add(project)
        db.session.commit()

        response = jsonify(project.to_dict())
        response.status_code = 201
        response.headers['Location'] = url_for(
            'api.get_project', id=project.id)

        return response

    except:
        return bad_request()


@bp.route('/projects/<int:id>', methods=['PUT'])
@token_auth.login_required
def update_project(id):
    project = Project.query.get_or_404(id)
    data = request.get_json() or {}

    project.from_dict(data, new_project=False)
    db.session.commit()

    return jsonify(project.to_dict())


@bp.route('/projects/<int:id>/publish', methods=['GET'])
@token_auth.login_required
def publish_project(id):
    project = Project.query.get_or_404(id)
    project.published = True

    db.session.commit()

    return jsonify(project.to_dict())


@bp.route('/projects/<int:id>', methods=['DELETE'])
@token_auth.login_required
def delete_projects(id):
    Project.query.filter_by(id=id).delete()

    db.session.commit()

    return '', 204
