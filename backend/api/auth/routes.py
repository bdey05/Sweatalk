from flask import request, jsonify, current_app, make_response
from api.auth import bp
from api.models.usermodel import AppUser
from api.models.revokedtoken import RevokedToken
from api.models.meal import Meal
from api.models.usermeal import UserMeal
from api.models.ingredient import Ingredient
from api.helpers import token_required
from api import db
import jwt
from datetime import datetime, timedelta, timezone, date


@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if AppUser.query.filter_by(email=data["email"]).first():
        return make_response(
            jsonify({"error": "User with this email already exists"}), 400
        )
    if AppUser.query.filter_by(username=data["username"]).first():
        return make_response(
            jsonify({"error": "User with this username already exists"}), 400
        )
    newUser = AppUser(
        username=data["username"],
        email=data["email"],
        age=data["age"],
        weight=data["weight"],
        height=data["height"],
    )
    newUser.set_password(data["password"])
    db.session.add(newUser)
    db.session.commit()
    user = AppUser.query.filter_by(email=data["email"]).first()
    token = jwt.encode(
        {"id": user.id, "exp": datetime.now(timezone.utc) + timedelta(hours=5)},
        current_app.config["SECRET_KEY"],
        "HS256",
    )
    userObj = {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "age": user.age,
        "weight": user.weight,
        "height": user.height,
    }
    return jsonify({"token": token, "userObj": userObj})


@bp.route("/login", methods=["POST"])
def login():
    auth = request.get_json()
    if not auth or "email" not in auth or "password" not in auth:
        return make_response(
            "Verification failed", 401, {"Authentication": 'Login required"'}
        )

    user = AppUser.query.filter_by(email=auth["email"]).first()
    if user.verify_password(auth["password"]):
        token = jwt.encode(
            {"id": user.id, "exp": datetime.now(timezone.utc) + timedelta(hours=5)},
            current_app.config["SECRET_KEY"],
            "HS256",
        )
        userObj = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "age": user.age,
            "weight": user.weight,
            "height": user.height,
        }
        return jsonify({"token": token, "userObj": userObj})

    return make_response(
        "Verification failed", 401, {"Authentication": 'Login required"'}
    )


@bp.route("/logout", methods=["POST"])
@token_required
def logout(current_user):
    newRevokedToken = RevokedToken(token=request.headers["x-access-tokens"])
    db.session.add(newRevokedToken)
    db.session.commit()
    return jsonify({"message": "Successfully logged out"}), 200



# Helper route during development to get all DB contents
@bp.route("/getdb")
def get_db_items():
    users = AppUser.query.all()
    userList = []
    for user in users:
        user_info = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "age": user.age,
            "weight": user.weight,
            "height": user.height,
        }
        userList.append(user_info)
    revokedTokens = RevokedToken.query.all()
    rtlist = []
    for rt in revokedTokens:
        rt_info = {"id": rt.id, "token": rt.token}
        rtlist.append(rt_info)
    allMeals = Meal.query.all()
    meallist = []
    for meal in allMeals:
        meallist.append(meal.to_dict())
    ingredients = Ingredient.query.all()
    ingredientlist = []
    for ig in ingredients:
        ingredientlist.append(ig.to_dict())
    usermeals = UserMeal.query.all()
    umlist = []
    for um in usermeals:
        um_info = {
            "id": um.id,
            "meal_id": um.meal_id,
            "user_id": um.user_id,
            "date": um.date,
        }
        umlist.append(um_info)
    return jsonify(
        {
            "users": userList,
            "revokedTokens": rtlist,
            "meals": meallist,
            "ingredients": ingredientlist,
            "usermeals": umlist,
        }
    )


# Helper route during development to clear all database tables
@bp.route("/cleardb")
def clear_db():
    UserMeal.query.delete()
    Ingredient.query.delete()
    Meal.query.delete()
    AppUser.query.delete()
    RevokedToken.query.delete()
    db.session.commit()
    return jsonify({"Clear": "Database cleared"})
