from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    # from package.task1.routes import task1_bp
    from package.blackhole.routes import blackhole_bp
    # app.register_blueprint(task1_bp, url_prefix="/api")
    app.register_blueprint(blackhole_bp, url_prefix="/api")

    return app
