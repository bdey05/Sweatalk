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

    #Instant Endpoint Relevant Fields: 
    # "branded"=Array of branded food objects that consist of key fields: 
    # (nix_item_id, brand_name_item_name, nf_calories, serving_qty, serving_unit)
    # "common"=Array of common food objects that consist of key fields:
    # (food_name, serving_qty, serving_unit, tag_id (to fillter out duplicates)) 
    try:
        res = requests.get(NUTRITIONIX_INSTANT_URL, headers=headers, params=params)
        res.raise_for_status()
        data = res.json()
        
        filteredData = {"branded": data["branded"][0], "common": data["common"][0]}
        apiData["Instant"] = filteredData
        #return jsonify(filteredData), 200 
    except requests.RequestException as e:
        return jsonify({'Error': 'Failed to communicate with API'}), 500
    
    #Common Endpoint Relevant Fields (use food_name from Instant Endpoint to hit this endpoint):
    #(food_name, alt_measures (array of measure objects), nf_calories, nf_protein, nf_total_carbohydrate, nf_total_fat (per listed serving)
    # serving_qty, serving_unit, full_nutrients(extra))
    try:
        res = requests.post(NUTRITIONIX_COMMON_URL, headers=headers, json={"query": filteredData['common']['food_name']})
        res.raise_for_status()
        data = res.json()
        apiData["Common"] = res.json()
        #return jsonify(data), 200
    except requests.RequestException as e:
        return jsonify({"Error: Could not access common endpoint"}), 500
    
    #Branded Endpoint Relevant Fields (use nix_item_id from Instant Endpoint to hit this endpoint):
    #(food_name, alt_measures (array of measure objects), nf_calories, nf_protein, nf_total_carbohydrate, nf_total_fat (per listed serving)
    # serving_qty, serving_unit, full_nutrients(extra))
    try:
        res = requests.get(NUTRITIONIX_BRANDED_URL, headers=headers, params={"nix_item_id": filteredData['branded']['nix_item_id']})
        res.raise_for_status()
        data = res.json()
        apiData["Branded"] = res.json()
        #return jsonify(data), 200
    except requests.RequestException as e:
        return jsonify({"Error: Could not access common endpoint"}), 500
    
    return jsonify(apiData), 200
    

@bp.route('/searchingredients', methods=['POST'])
@token_required
def ingredients(current_user):
    data = request.get_json()
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
        "query": data["query"]
    }
    try:
        res = requests.get(NUTRITIONIX_INSTANT_URL, headers=headers, params=params)
        res.raise_for_status()
        data = res.json()
        search_results = [
            *list(map(lambda food: food["brand_name_item_name"], data["branded"][:5])),
            *list(map(lambda food: food["food_name"], data["common"][:5]))
        ]
        branded_food = data["branded"][:5]
        common_food = data["common"][:5]

        #return jsonify(search_results), 200 
    except requests.RequestException as e:
        return jsonify({'Error': 'Failed to communicate with API'}), 500

    branded_data={}
    for bf in branded_food:
        try:
            res = requests.get(NUTRITIONIX_BRANDED_URL, headers=headers, params={"nix_item_id": bf['nix_item_id']})
            res.raise_for_status()
            branded_data[bf['nix_item_id']] = res.json()
            #return jsonify(data), 200
        except requests.RequestException as e:
            return jsonify({"Error: Could not access common endpoint"}), 500
        
    
    return jsonify(branded_food), 200