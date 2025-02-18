from flask import Blueprint

bp = Blueprint('landing', __name__)

from api.landing import routes 