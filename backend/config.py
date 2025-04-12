import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, ".env"))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "Temporary-Key"
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    USDA_KEY = os.environ.get("USDA_KEY")
    USDA_SEARCH_URL = os.environ.get("USDA_SEARCH_URL")
    USDA_FOOD_DETAIL_URL = os.environ.get("USDA_FOOD_DETAIL_URL")
    USDA_FOODS_URL = os.environ.get("USDA_FOODS_URL")


class ConfigDevelopment(Config):
    pass


class ConfigProduction(Config):
    pass
