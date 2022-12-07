import uuid
import base64
import os
from flask import url_for, current_app
from datetime import datetime
from datetime import timedelta
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.exc import NoResultFound
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

from app import db

user_project = db.Table('user_project',
                        db.Column('user_id', db.Integer,
                                  db.ForeignKey('user.id')),
                        db.Column('project_id', db.Integer,
                                  db.ForeignKey('project.id'))
                        )

user_tag = db.Table('user_tag',
                    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
                    )


class PaginatedMixin(object):
    @staticmethod
    def to_collection_dict(query, page, per_page, include, endpoint, id=None, **kwargs):
        resources = query.paginate(page, per_page, False)
        data = {
            'items': [item.to_dict(include, id) for item in resources.items],
            '_meta': {
                'page': page,
                'per_page': per_page,
                'total_pages': resources.pages,
                'total_items': resources.total
            },
            '_links': {
                'self': url_for(endpoint, page=page, per_page=per_page, **kwargs),
                'next': url_for(endpoint, page=page + 1, per_page=per_page, **kwargs) if resources.has_next else None,
                'prev': url_for(endpoint, page=page - 1, per_page=per_page, **kwargs) if resources.has_prev else None
            }
        }

        return data


class Tag(db.Model):
    __tablename__ = "tag"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    _project = db.relationship("Project", back_populates="_tag")
    _users = db.relationship("User", secondary=user_tag, back_populates="_tags")

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)


class Project(PaginatedMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag_id = db.Column(db.Integer, ForeignKey("tag.id"))
    name = db.Column(db.String, unique=False, nullable=False)
    description = db.Column(db.String, unique=False, nullable=True)
    size = db.Column(db.Integer, unique=False, nullable=False)
    published = db.Column(db.Boolean, unique=False,
                          nullable=False, default=False)
    contributor_id = db.Column(db.Integer, ForeignKey("user.id"))

    _tag = db.relationship("Tag", back_populates="_project")
    _user = db.relationship("User", back_populates="_project")
    _users = db.relationship("User", secondary=user_project, back_populates="_projects")

    @validates('size')
    def validate_size(self, key, size):

        if size <= 0 and size > 100:
            raise ValueError('Invalid size range must be between 1 and 100')

        return size

    def to_dict(self, include=False, user_id=None):
        data = {
            'id': self.id,
            'name': self.name,
            '_links': {
                'self': url_for('api.get_project', id=self.id)
            }
        }

        if include:
            joined = None
            tag = Tag.query.filter_by(
                id=self.tag_id).first()

            if (user_id):
                joined = Project.query.filter(Project._users.any(id=user_id), Project.id.like(self.id)).first()
                closed = len(User.query.filter(User._projects.any(id=self.id)).all()) >= self.size
                data['joined'] = joined != None
                data['closed'] = closed
            data['tag'] = tag.name
            data['size'] = self.size
            data['description'] = self.description
            data['published'] = self.published

        return data

    def from_dict(self, data, new_project=False):
        for field in ['name', 'size', 'description']:
            if field in data:
                setattr(self, field, data[field])

        if new_project and 'tag' in data:
            tag = Tag.query.filter_by(
                name=data['tag']).first()
            if tag:
                self.tag_id = tag.id
            else:
                raise NoResultFound()

        if new_project and 'contributor_id' in data:
            self.contributor_id = data['contributor_id']


class User(PaginatedMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.Integer, unique=True, nullable=False)
    role_id = db.Column(db.Integer, ForeignKey("role.id"), nullable=True)
    email = db.Column(db.String, unique=True, nullable=False)
    _username = db.Column(db.String, unique=True, nullable=False)
    _password = db.Column("password", db.String, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    token = db.Column(db.String(32), index=True, unique=True)
    skip_q = db.Column(db.Boolean, default=False)
    token_expiration = db.Column(db.DateTime)

    _tags = db.relationship("Tag", secondary=user_tag, back_populates="_users")
    _projects = db.relationship("Project", secondary=user_project, back_populates="_users")
    _project = db.relationship("Project", back_populates="_user")

    @hybrid_property
    def username(self):
        return self._username

    @hybrid_property
    def password(self):
        return self._password

    @username.setter
    def username(self, value):
        self._username = value

    @password.setter
    def password(self, value):
        """Store the password as a hash for security."""
        self._password = generate_password_hash(value)

    def check_password(self, value):
        return check_password_hash(self.password, value)

    def to_dict(self, include=False, id=None):
        data = {
            'id': self.id,
            'email': self.email,
            '_links': {
                'self': url_for('api.get_user', id=self.id)
            }
        }

        if include:
            role = Role.query.filter_by(
            id=self.role_id).first()
            data['first_name'] = self.first_name
            data['last_name'] = self.last_name
            data['public_id'] = self.public_id
            data['username'] = self.username
            data['role'] = role.name if role else 'None'

        return data

    def from_dict(self, data, new_user=False):
        for field in ['email', 'first_name', 'last_name']:
            if field in data:
                setattr(self, field, data[field])

        if 'role' in data:
            role = Role.query.filter_by(name=data['role']).first()
            self.role_id = role.id

        if new_user and 'password' in data:
            self.password = data['password']
            self.public_id = str(uuid.uuid4())
            self.username = self.email

    def get_role(self):
        name = Role.query.filter_by(id=self.role_id).first()
        return name

    def get_skip(self):
        return self.skip_q

    def get_token(self, expires_in=3600):
        now = datetime.utcnow()
        if self.token and self.token_expiration > now + timedelta(seconds=60):
            return self.token

        self.token = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + timedelta(seconds=expires_in)
        db.session.add(self)
        return self.token

    def revoke_token(self):
        self.token_expiration = datetime.utcnow() - timedelta(seconds=1)

    @staticmethod
    def check_token(token):
        user = User.query.filter_by(token=token).first()
        if user is None or user.token_expiration < datetime.utcnow():
            return None

        return user


def load_staging():

    tags = Tag.query.all()

    if len(tags) == 0:
        db.session.add(Tag(name='sports'))
        db.session.add(Tag(name='science'))
        db.session.add(Tag(name='programming'))

        db.session.commit()

    roles = Role.query.all()

    if len(roles) == 0:
        db.session.add(Role(name='basic'))
        db.session.add(Role(name='contributor'))
        db.session.add(Role(name='admin'))

        db.session.commit()

    admin = User.query.filter_by(role_id=3).first()

    if admin is None:
        db.session.add(User(
            email='admin@test.test',
            first_name='admin',
            last_name='tester',
            role_id=3,
            password='test1234',
            _username='admin@test.test',
            public_id=str(uuid.uuid4()),
            skip_q=True
        ))

        db.session.add(User(
            email='contributor@test.test',
            first_name='contributor',
            last_name='tester',
            role_id=2,
            password='test1234',
            _username='contributor@test.test',
            public_id=str(uuid.uuid4()),
            skip_q=True
        ))

        db.session.add(User(
            email='aTester@test.test',
            first_name='alice',
            last_name='tester',
            password='test1234',
            role_id=1,
            _username='aTester@test.test',
            public_id=str(uuid.uuid4()),
            skip_q=True
        ))

        db.session.add(User(
            email='bTester@test.test',
            first_name='brian',
            last_name='tester',
            password='test1234',
            role_id=1,
            _username='bTester@test.test',
            public_id=str(uuid.uuid4()),
            skip_q=False
        ))

        db.session.commit()

    projects = Project.query.all()

    if len(projects) == 0:
        db.session.add(Project(
            name="Test Programing Project",
            description="A staged project representing a programming project or activity",
            size=4,
            tag_id=3,
            published=True,
            contributor_id=2
        ))

        db.session.add(Project(
            name="Test Sports Project",
            description="A staged project representing a sports project or activity",
            size=4,
            tag_id=1,
            published=True,
            contributor_id=2
        ))

        db.session.add(Project(
            name="Test Science Project",
            description="A staged project representing a science project or activity",
            size=4,
            tag_id=2,
            published=True,
            contributor_id=2
        ))

        db.session.commit()

    basic_user = User.query.filter_by(first_name='alice').first()
    prog_tag = Tag.query.filter_by(id=3).first()
    prog_project = Project.query.filter_by(tag_id=3).first()

    basic_user._tags.append(prog_tag)
    prog_project._users.append(basic_user)

    db.session.commit()
