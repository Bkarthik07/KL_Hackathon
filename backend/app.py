from flask import Flask
from flask_cors import CORS
from backend.config import Config
from backend.database import get_db, close_db, init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    with app.app_context():
        init_db()

    from backend.routes.api import api_bp
    from backend.routes.webhook import webhook_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(webhook_bp, url_prefix='/webhook')

    app.teardown_appcontext(close_db)
    return app


# expose an app instance for flask CLI or WSGI servers
app = create_app()

if __name__ == '__main__':
    # allow running directly with `python app.py`
    app.run(debug=True)