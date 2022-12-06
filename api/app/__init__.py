import os

import click
from flask import Flask
from flask import Blueprint
from flask.cli import with_appcontext
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

__version__ = (1, 0, 0, "dev")

db = SQLAlchemy()


def create_app(test_config=None):
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)
    app.app_context().push()

    # some deploy systems set the database url in the environ
    db_url = os.environ.get("DATABASE_URL")

    if db_url is None:
        # default to sqlite database in the instance folder
        db_path = os.path.join(app.instance_path, "teamup.sqlite")
        db_url = f"sqlite:///{db_path}"
        # ensure the instance folder exists
        os.makedirs(app.instance_path, exist_ok=True)

    app.config.from_mapping(
        # default secret that should be overriden in invorn or config
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev"),
        SQLALCHEMY_DATABASE_URI=db_url,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        CORS_ALLOW_HEADERS=['Content-Type', 'Authorization'],
        CORS_SUPPORTS_CREDENTIALS=True
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.update(test_config)

    # initialize Flask-SQLAlchemy and the init-db command
    db.init_app(app)
    app.cli.add_command(init_db_command)
    app.cli.add_command(load_staging_command)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    CORS(app, origins=['http://localhost:3000', 'http://localhost'])

    return app


def init_db():
    db.drop_all()
    db.create_all()

def load_staging():
    from app.models import load_staging as load
    load()

@click.command("init-db")
@with_appcontext
def init_db_command():
    """Clear existing data and create new tables."""
    init_db()
    click.echo("Initialized the database.")

@click.command("load-staging")
@with_appcontext
def load_staging_command():
    load_staging()
    click.echo("Loading staging data into database")
