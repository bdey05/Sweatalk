from flask import request, jsonify, current_app, make_response, current_app
from api.meals import bp
from api.models.usermodel import AppUser
from api.models.revokedtoken import RevokedToken
from api.helpers import token_required
from api import db
import requests 

@bp.route('/meals')
#@token_required
def meals():
    NUTRITIONIX_URL=current_app.config.get('NUTRITIONIX_URL')
    APP_ID=current_app.config.get('APP_ID')
    APP_KEY=current_app.config.get('APP_KEY')
    headers = {
        'Content-Type': 'application/json',
        'x-app-id': APP_ID,
        'x-app-key': APP_KEY
    }
    params = {
        "query": "grape"
    }
    try:
        res = requests.get(NUTRITIONIX_URL, headers=headers, params=params)
        res.raise_for_status()
        return jsonify(res.json()), 200 
    except requests.RequestException as e:
        return jsonify({'Error': 'Failed to communicate with API'}), 500
