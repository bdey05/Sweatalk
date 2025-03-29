from flask import request, jsonify, current_app, make_response, current_app
from api.meals import bp
from api.models.usermodel import AppUser
from api.models.revokedtoken import RevokedToken
from api.helpers import token_required
from api import db
import requests


@bp.route("/meals")
# @token_required
def meals():
    NUTRITIONIX_INSTANT_URL = current_app.config.get("NUTRITIONIX_INSTANT_URL")
    NUTRITIONIX_COMMON_URL = current_app.config.get("NUTRITIONIX_COMMON_URL")
    NUTRITIONIX_BRANDED_URL = current_app.config.get("NUTRITIONIX_BRANDED_URL")

    APP_ID = current_app.config.get("APP_ID")
    APP_KEY = current_app.config.get("APP_KEY")

    headers = {
        "Content-Type": "application/json",
        "x-app-id": APP_ID,
        "x-app-key": APP_KEY,
    }
    params = {"query": "grape"}

    apiData = {}

    # Instant Endpoint Relevant Fields:
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
        # return jsonify(filteredData), 200
    except requests.RequestException as e:
        return jsonify({"Error": "Failed to communicate with API"}), 500

    # Common Endpoint Relevant Fields (use food_name from Instant Endpoint to hit this endpoint):
    # (food_name, alt_measures (array of measure objects), nf_calories, nf_protein, nf_total_carbohydrate, nf_total_fat (per listed serving)
    # serving_qty, serving_unit, full_nutrients(extra))
    try:
        res = requests.post(
            NUTRITIONIX_COMMON_URL,
            headers=headers,
            json={"query": filteredData["common"]["food_name"]},
        )
        res.raise_for_status()
        data = res.json()
        apiData["Common"] = res.json()
        # return jsonify(data), 200
    except requests.RequestException as e:
        return jsonify({"Error: Could not access common endpoint"}), 500

    # Branded Endpoint Relevant Fields (use nix_item_id from Instant Endpoint to hit this endpoint):
    # (food_name, alt_measures (array of measure objects), nf_calories, nf_protein, nf_total_carbohydrate, nf_total_fat (per listed serving)
    # serving_qty, serving_unit, full_nutrients(extra))
    try:
        res = requests.get(
            NUTRITIONIX_BRANDED_URL,
            headers=headers,
            params={"nix_item_id": filteredData["branded"]["nix_item_id"]},
        )
        res.raise_for_status()
        data = res.json()
        apiData["Branded"] = res.json()
        # return jsonify(data), 200
    except requests.RequestException as e:
        return jsonify({"Error: Could not access common endpoint"}), 500

    return jsonify(apiData), 200


"""
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
"""
NUTRIENT_ID_CALORIES = "208"
NUTRIENT_ID_PROTEIN = "203"
NUTRIENT_ID_FAT = "204"
NUTRIENT_ID_CARBS = "205"


@bp.route("/searchingredients", methods=["POST"])
@token_required
def ingredients(current_user):
    data = request.get_json()
    query = data.get("query")

    USDA_KEY = current_app.config.get("USDA_KEY")
    USDA_SEARCH_URL = current_app.config.get("USDA_SEARCH_URL")
    USDA_FOOD_DETAIL_URL = current_app.config.get("USDA_FOOD_DETAIL_URL")

    search_params = {
        "api_key": USDA_KEY,
        "query": query,
        "pageSize": 10,
        "dataType": ["Foundation", "SR Legacy", "Branded"],
    }

    try:
        search_res = requests.get(USDA_SEARCH_URL, params=search_params)
        search_res.raise_for_status()  
        search_data = search_res.json()
    except request.RequestException:
        return jsonify({"Error": "Error processing search results"}, 500)

    foods = search_data.get("foods", [])
    if not foods:
        return jsonify([]), 200
    
    detailed_food_results = []
    processed_fdc_ids = set() 

    detail_fetch_limit = 5
    fetched_count = 0

    for food in foods:
        if fetched_count >= detail_fetch_limit:
            break

        fdcId = food.get("fdcId")
        if not fdcId or fdcId in processed_fdc_ids:
            continue

        processed_fdc_ids.add(fdcId)
        detail_url = USDA_FOOD_DETAIL_URL + fdcId
        detail_params = {
            "api_key": USDA_KEY,
            "nutrients": [NUTRIENT_ID_CALORIES, NUTRIENT_ID_PROTEIN, NUTRIENT_ID_FAT, NUTRIENT_ID_CARBS]
        }

        try:
            detail_res = requests.get(detail_url, params=detail_params)
            detail_res.raise_for_status()
            food_detail = detail_res.json()
        except request.RequestException:
            continue 
        
        food_name = food_detail.get("description", "N/A")
        nutrients_map = {n.get("nutrient", {}).get("id"): n for n in food_detail.get("foodNutrients", [])}

        base_calories = nutrients_map.get(int(NUTRIENT_ID_CALORIES), {}).get("amount", 0)
        base_protein = nutrients_map.get(int(NUTRIENT_ID_PROTEIN), {}).get("amount", 0)
        base_fat = nutrients_map.get(int(NUTRIENT_ID_FAT), {}).get("amount", 0)
        base_carbs = nutrients_map.get(int(NUTRIENT_ID_CARBS), {}).get("amount", 0)

        portions = food_detail.get("foodPortions", [])
        serving_options = []

        if not portions and food_detail.get("servingSize") and food_detail.get("servingSizeUnit"):
            gram_weight = float(food_detail.get("servingSize", 100))
            unit_desc = f"{gram_weight} {food_detail.get('servingSizeUnit')}"

            factor = gram_weight / 100.0
            serving_options.append({
                "unit": unit_desc,
                "gramWeight": gram_weight,
                "calories": round(base_calories * factor, 2) if base_calories is not None else None,
                "protein": round(base_protein * factor, 2) if base_protein is not None else None,
                "fat": round(base_fat * factor, 2) if base_fat is not None else None,
                "carbohydrates": round(base_carbs * factor, 2) if base_carbs is not None else None,
            })

        elif portions:
            for portion in portions:
                gram_weight = portion.get("gramWeight")
                unit_desc = portion.get("portionDescription")
                if not unit_desc:
                    amount = portion.get('amount', '')
                    modifier = portion.get('modifier', '')
                    unit_desc = f"{amount} {modifier}".strip()

                if gram_weight and unit_desc: 
                    factor = float(gram_weight) / 100.0
                    serving_options.append({
                        "unit": unit_desc,
                        "gramWeight": float(gram_weight),
                        "calories": round(base_calories * factor, 2) if base_calories is not None else None,
                        "protein": round(base_protein * factor, 2) if base_protein is not None else None,
                        "fat": round(base_fat * factor, 2) if base_fat is not None else None,
                        "carbohydrates": round(base_carbs * factor, 2) if base_carbs is not None else None,
                    })
    
        if serving_options:
            detailed_food_results.append({
                "fdcId": fdcId,
                "name": food_name,
                "servings": serving_options
            })
            fetched_count += 1

    return jsonify(detailed_food_results), 200
