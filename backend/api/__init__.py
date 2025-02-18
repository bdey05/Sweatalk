from flask import Flask
from config import Config, ConfigDevelopment, ConfigProduction 
from flask_sqlalchemy import SQLAlchemy

#db = SQLAlchemy()


def create_app(config_class=ConfigDevelopment):
    app = Flask(__name__)
    app.config.from_object(config_class)

    #db.init_app(app)

    #with app.app_context():
        #db.create_all()
    
    from api.auth import bp as authbp
    app.register_blueprint(authbp)
    
    from api.landing import bp as landingbp
    app.register_blueprint(landingbp)
    
    return app 