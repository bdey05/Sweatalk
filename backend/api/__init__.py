from flask import Flask
from config import Config, ConfigDevelopment, ConfigProduction 
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS


db = SQLAlchemy()
bcrypt = Bcrypt()


from api.models.usermodel import AppUser 
from api.models.revokedtoken import RevokedToken 
from api.models.ingredient import Ingredient 
from api.models.meal import Meal 
from api.models.usermeal import UserMeal 


def create_app(config_class=ConfigDevelopment):
    app = Flask(__name__)
    CORS(app)

    
    app.config.from_object(config_class)

    db.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        try:
            db.drop_all()
            db.create_all()
            print("Success")
        except:
            print("Error")
    
    from api.auth import bp as authbp
    app.register_blueprint(authbp)
    
    from api.meals import bp as mealsbp
    app.register_blueprint(mealsbp)

    return app 