from flask import request, jsonify, current_app, make_response, current_app
from api.meals import bp
from api.models.usermodel import AppUser
from api.models.revokedtoken import RevokedToken
from api.helpers import token_required
from api import db
import requests
from api.models.usermodel import AppUser
from api.models.meal import Meal
from api.models.usermeal import UserMeal
from api.models.ingredient import Ingredient
from sqlalchemy.orm import joinedload, selectinload
from datetime import datetime, date


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

    headers = {
        "Accept": "application/json"
    }

    search_params = {
        "api_key": USDA_KEY,
        "query": query,
        "pageSize": 10,
        "pageNumber": 1,
        "dataType": ["Foundation", "SR Legacy", "Branded", "Survey (FNDDS)"]
    }

    try:
        search_res = requests.get(USDA_SEARCH_URL, params=search_params, headers=headers)
        search_res.raise_for_status()  
        search_data = search_res.json()
    except request.RequestException:
        return jsonify({"Error": "Error processing search results"}, 500)

    foods = search_data.get("foods", [])
    if not foods:
        return jsonify({"No foods found"}), 200
    
    detailed_food_results = []
    processed_fdc_ids = set() 

    

    for food in foods:
        
        
        
        fdcId = food.get("fdcId")
        
        if not fdcId or fdcId in processed_fdc_ids:
            continue

        processed_fdc_ids.add(fdcId)
        detail_url = str(USDA_FOOD_DETAIL_URL) + str(fdcId)

        detail_params = {
            "api_key": USDA_KEY,
            "nutrients": [NUTRIENT_ID_CALORIES, NUTRIENT_ID_PROTEIN, NUTRIENT_ID_FAT, NUTRIENT_ID_CARBS]
        }

        try:
            detail_res = requests.get(detail_url, params=detail_params, headers=headers)
            detail_res.raise_for_status()
            food_detail = detail_res.json()
            
        except request.RequestException:
            continue 
        
        if food_detail.get("dataType") == "Branded":
            food_name = str(food_detail.get("brandName")) + " " + str(food_detail.get("description"))
        else:
            food_name = food_detail.get("description", "N/A")

        
        nutrients_map = {n.get("nutrient", {}).get("number"): n for n in food_detail.get("foodNutrients", [])}

        base_calories = nutrients_map.get(NUTRIENT_ID_CALORIES, {}).get("amount", 0)
        base_protein = nutrients_map.get(NUTRIENT_ID_PROTEIN, {}).get("amount", 0)
        base_fat = nutrients_map.get(NUTRIENT_ID_FAT, {}).get("amount", 0)
        base_carbs = nutrients_map.get(NUTRIENT_ID_CARBS, {}).get("amount", 0)


        portions = food_detail.get("foodPortions", [])
        serving_options = []


        #Get nutrient data per gram
        if not portions and food_detail.get("servingSize") and food_detail.get("servingSizeUnit"):
            gram_weight = float(food_detail.get("servingSize", 100))
            unit_desc = f"{food_detail.get('servingSizeUnit')}"

            factor = gram_weight / 100.0
            if str(unit_desc) != "Quantity not specified":
                serving_options.append({
                    "unit": unit_desc,
                    "gramWeight": gram_weight,
                    "calories": round((base_calories * factor) / gram_weight, 2) if base_calories is not None else None,
                    "protein": round((base_protein * factor) / gram_weight, 2) if base_protein is not None else None,
                    "fat": round((base_fat * factor) / gram_weight, 2) if base_fat is not None else None,
                    "carbohydrates": round((base_carbs * factor) / gram_weight, 2) if base_carbs is not None else None,
                })

        #Get nutrient data per each serving unit (1 cup, 1 chicken thigh, etc.)
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
                    if str(unit_desc) != "Quantity not specified":
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
            

    return jsonify({"items": detailed_food_results}), 200


@bp.route("/getmeals", methods=["POST"])
@token_required
def get_meals(current_user):
    search_data = request.get_json()
    date = datetime.strptime(search_data.get("date"), '%Y-%m-%d').date()
    user_meals = db.session.query(UserMeal).options(
        joinedload(UserMeal.meal).joinedload(Meal.ingredients)
    ).filter(
        UserMeal.user_id == current_user.id,
        UserMeal.date == date
    ).all()

    meals_list = [um.meal.to_dict() for um in user_meals if um.meal]

    return jsonify(meals_list), 200

    
@bp.route("/addmeal", methods=["POST"])
@token_required
def add_meal(current_user):
    req_data = request.get_json()
    meal_info = req_data["meal"]
    meal_date = datetime.strptime(req_data["date"], '%Y-%m-%d').date()

    newMeal = Meal(
        name=meal_info["name"], 
        calories=meal_info["calories"],
        protein=meal_info["protein"],
        carbohydrates=meal_info["carbohydrates"],
        fat=meal_info["fat"],
        serving_qty=meal_info["servingQty"],
        is_saved=meal_info["isSaved"]
    )

    db.session.add(newMeal)

    mealIngredients = meal_info["ingredients"]

    for ig in mealIngredients:
        meal_units = []
        for aU in ig["servingUnits"]:
            meal_units.append(aU)
        newIngredient = Ingredient (
            name=ig["name"],
            meal=newMeal,
            fdc_id=ig["fdcId"],
            selected_serving_unit=ig["selectedServingUnit"],
            selected_serving_qty=ig["selectedServingQty"],
            available_units=meal_units
        )
        db.session.add(newIngredient)

    newUserMeal = UserMeal (
        user_id=current_user.id,
        meal=newMeal,
        date=meal_date
    )
    db.session.add(newUserMeal)
    db.session.commit()

    return jsonify({"New User Meal": newUserMeal.to_dict()}), 200 



@bp.route("/deletemeal", methods=["DELETE"])
@token_required
def delete_meal(current_user):
    pass

@bp.route("/editmeal/<int:meal_id>", methods=["PUT"])
@token_required
def edit_meal(current_user, meal_id):
    updated_meal = request.get_json()
    meal_to_update = db.session.query(Meal).options(
        selectinload(Meal.ingredients)
    ).join(UserMeal, UserMeal.meal_id == Meal.id).filter(
        Meal.id == meal_id,
        UserMeal.user_id == current_user.id 
    ).first()

    for current_ingredient in meal_to_update.ingredients:
        db.session.delete(current_ingredient)
    
    meal_to_update.name = updated_meal["name"]
    meal_to_update.calories = updated_meal["calories"]
    meal_to_update.protein = updated_meal["protein"]
    meal_to_update.carbohydrates = updated_meal["carbohydrates"]
    meal_to_update.fat = updated_meal["fat"]
    meal_to_update.serving_qty = updated_meal["servingQty"]
    meal_to_update.is_saved = updated_meal["isSaved"]

    for ig in updated_meal["ingredients"]:
        newIngredient = Ingredient (
            name=ig["name"],
            meal_id=meal_to_update.id,
            fdc_id=ig["fdc_id"],
            selected_serving_unit=ig["selected_serving_unit"],
            selected_serving_qty=ig["selected_serving_qty"],
            available_units=ig["available_units"]
        )
        db.session.add(newIngredient)
    db.session.commit()
    updated_meal = db.session.query(Meal).options(
            selectinload(Meal.ingredients)
        ).filter(Meal.id == meal_id).first()
    return jsonify(updated_meal.to_dict()), 200



