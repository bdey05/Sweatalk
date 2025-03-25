from flask import request, jsonify, current_app, make_response, current_app
from api.meals import bp
from api.models.usermodel import AppUser
from api.models.revokedtoken import RevokedToken
from api.helpers import token_required
from api import db
import requests 

@bp.route('/meals')
#@token_required
def meals(methods=['GET', 'POST']):
    NUTRITIONIX_INSTANT_URL=current_app.config.get('NUTRITIONIX_INSTANT_URL')
    NUTRITIONIX_COMMON_URL=current_app.config.get('NUTRITIONIX_COMMON_URL')
    NUTRITIONIX_BRANDED_URL=current_app.config.get('NUTRITIONIX_BRANDED_URL')

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
    
    apiData = {}

    #Instant Endpoint Relevant Fields: "Branded"=Array of branded food objects(nix_item_id, brand_name_item_name, nf_calories, serving_qty, serving_unit)
    try:
        res = requests.get(NUTRITIONIX_INSTANT_URL, headers=headers, params=params)
        res.raise_for_status()
        data = res.json()
        
        filteredData = {"branded": data["branded"][0], "common": data["common"][0]}
        apiData["Instant"] = filteredData
        #return jsonify(filteredData), 200 
    except requests.RequestException as e:
        return jsonify({'Error': 'Failed to communicate with API'}), 500
    
    
    try:
        res = requests.post(NUTRITIONIX_COMMON_URL, headers=headers, json={"query": filteredData['common']['food_name']})
        res.raise_for_status()
        data = res.json()
        apiData["Common"] = res.json()
        #return jsonify(data), 200
    except requests.RequestException as e:
        return jsonify({"Error: Could not access common endpoint"}), 500
    
    try:
        res = requests.get(NUTRITIONIX_BRANDED_URL, headers=headers, params={"nix_item_id": filteredData['branded']['nix_item_id']})
        res.raise_for_status()
        data = res.json()
        apiData["Branded"] = res.json()
        #return jsonify(data), 200
    except requests.RequestException as e:
        return jsonify({"Error: Could not access common endpoint"}), 500
    
    return jsonify(apiData), 200
    
    