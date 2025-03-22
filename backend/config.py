import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'Temporary-Key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    APP_ID = os.environ.get('APP_ID')
    APP_KEY = os.environ.get('APP_KEY')
    NUTRITIONIX_URL = os.environ.get('NUTRITIONIX_URL')
    

class ConfigDevelopment(Config):
    pass 

class ConfigProduction(Config):
    pass