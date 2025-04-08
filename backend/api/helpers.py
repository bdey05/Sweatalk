from functools import wraps
from flask import request, jsonify, current_app
from api.models.usermodel import AppUser
from api.models.revokedtoken import RevokedToken
import jwt


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if "x-access-tokens" in request.headers:
            token = request.headers["x-access-tokens"]

        if not token:
            return jsonify({"message": "Missing valid token"})

        if RevokedToken.query.filter_by(token=token).first() is not None:
            return jsonify({"message": "Token has been revoked"})

        try:
            data = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
            )
            current_user = AppUser.query.filter_by(id=data["id"]).first()
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"})
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token is invalid"})

        return f(current_user, *args, **kwargs)

    return decorator
