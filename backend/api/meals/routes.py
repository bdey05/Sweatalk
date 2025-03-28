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
    

from flask import request, jsonify, current_app
from api.meals import bp
from api.helpers import token_required
import requests


@bp.route('/searchingredients', methods=['POST'])
@token_required
def ingredients(current_user):
    data = request.get_json()

    NUTRITIONIX_INSTANT_URL = current_app.config.get('NUTRITIONIX_INSTANT_URL')
    NUTRITIONIX_COMMON_URL = current_app.config.get('NUTRITIONIX_COMMON_URL')
    NUTRITIONIX_BRANDED_URL = current_app.config.get('NUTRITIONIX_BRANDED_URL')

    APP_ID = current_app.config.get('APP_ID')
    APP_KEY = current_app.config.get('APP_KEY')

    headers = {
        'Content-Type': 'application/json',
        'x-app-id': APP_ID,
        'x-app-key': APP_KEY
    }

    query = data.get("query")
    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        res = requests.get(NUTRITIONIX_INSTANT_URL, headers=headers, params={"query": query})
        res.raise_for_status()
        instant_data = res.json()

        branded_items = instant_data.get("branded", [])[:5]
        common_items = instant_data.get("common", [])[:5]
    except requests.RequestException as e:
        return jsonify({'error': 'Failed to communicate with Nutritionix API'}), 500

    def extract_food_info(food_data, is_branded=False):
        '''return {
            "food_name": food_data.get("food_name") if not is_branded else food_data.get("brand_name_item_name"),
            "nix_item_id": food_data.get("nix_item_id") if is_branded else None,
            "calories": food_data.get("nf_calories") / food_data.get("serving_qty"),
            "carbohydrates": food_data.get("nf_total_carbohydrate") / food_data.get("serving_qty"),
            "protein": food_data.get("nf_protein") / food_data.get("serving_qty"),
            "fat": food_data.get("nf_total_fat") / food_data.get("serving_qty"),
            "serving_unit": food_data.get("serving_unit"),
            "serving_quantity": food_data.get("serving_qty") / food_data.get("serving_qty"),
            "alt_measures": food_data.get("alt_measures", [])
        }'''
        return {
            "food_name": food_data.get("food_name"),
            "nix_item_id": food_data.get("nix_item_id") if is_branded else None,
            "calories": food_data.get("nf_calories") ,
            "carbohydrates": food_data.get("nf_total_carbohydrate"),
            "protein": food_data.get("nf_protein"),
            "fat": food_data.get("nf_total_fat"),
            "serving_unit": food_data.get("serving_unit"),
            "serving_quantity": food_data.get("serving_qty"),
            "alt_measures": food_data.get("alt_measures", [])
        }

    food_items = []

    for common in common_items:
        try:
            res = requests.post(NUTRITIONIX_COMMON_URL, headers=headers, json={"query": common["food_name"]})
            res.raise_for_status()
            common_details = res.json()
            if common_details.get("foods"):
                food_items.append(extract_food_info(common_details["foods"][0], is_branded=False))
        except requests.RequestException:
            continue

    for branded in branded_items:
        try:
            res = requests.get(NUTRITIONIX_BRANDED_URL, headers=headers, params={"nix_item_id": branded["nix_item_id"]})
            res.raise_for_status()
            branded_details = res.json()
            food_items.append(branded_details)
            print(branded_details)

            # Ensure correct handling of branded data
            if "foods" in branded_details and branded_details["foods"]:
                food_items.append(extract_food_info(branded_details["foods"][0], is_branded=True))
        except requests.RequestException:
            continue


    return jsonify(food_items, branded_items), 200
