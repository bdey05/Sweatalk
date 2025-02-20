from flask import Flask
from config import Config, ConfigDevelopment, ConfigProduction 
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

from api.models.usermodel import AppUser 

def create_app(config_class=ConfigDevelopment):
    app = Flask(__name__)
    
    app.config.from_object(config_class)

    db.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        try:
            db.create_all()
            print("Success")
        except:
            print("Error")
    
    from api.auth import bp as authbp
    app.register_blueprint(authbp)
    
    from api.landing import bp as landingbp
    app.register_blueprint(landingbp)
    
    return app 