from app.api import bp
from flask import abort
from app import db
from app.models import Project, Tag
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
    user = token_auth.current_user()
    role_id = user.role_id
    page = request.args.get('page', 1, type=int)
    include = 'include' in request.args
    per_page = min(request.args.get('per_page', 10, type=int), 100)

    if role_id == 2:
        data = Project.to_collection_dict(
            Project.query.filter_by(contributor_id=user.id), page, per_page, include, 'api.get_projects')
        return jsonify(data)

    if role_id == 1:
        tags = [id[0] for id in Tag.query.with_entities(Tag.id).filter(Tag._users.any(
            id=user.id)).all()]

        data = Project.to_collection_dict(
            Project.query.filter(Project.tag_id.in_(tags)), page, per_page, include, 'api.get_projects', user.id)
        return jsonify(data)

    if role_id == 3:
        data = Project.to_collection_dict(
            Project.query, page, per_page, include, 'api.get_projects')
        return jsonify(data)

    return bad_request()


@bp.route('/projects', methods=['POST'])
@token_auth.login_required
def create_project():
    data = request.get_json() or {}

    if 'name' not in data or 'size' not in data:
        return bad_request()

    if (token_auth.current_user().role_id == 1):
        return bad_request()

    data['contributor_id'] = token_auth.current_user().id
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

@bp.route('/projects/<int:id>/join', methods=['GET'])
@token_auth.login_required
def join_project(id):
    user = token_auth.current_user()

    if (user.role_id != 1):
        return bad_request()

    project = Project.query.get_or_404(id)
    project._users.append(user)

    db.session.commit()

    return '', 204

@bp.route('/projects/<int:id>', methods=['DELETE'])
@token_auth.login_required
def delete_projects(id):
    Project.query.filter_by(id=id).delete()

    db.session.commit()

    return '', 204
