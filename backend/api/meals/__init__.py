from flask import Blueprint

bp = Blueprint('meals', __name__)

from api.meals import routes 