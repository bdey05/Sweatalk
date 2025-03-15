from functools import wraps
from flask import request, jsonify, current_app, make_response
from api.auth import bp 
from api.models.usermodel import AppUser
from api.models.revokedtoken import RevokedToken
from api.helpers import token_required
from api import db
import jwt 
from datetime import datetime, timedelta, timezone

'''blacklist = set()

def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):
       token = None
       if 'x-access-tokens' in request.headers:
           token = request.headers['x-access-tokens']
 
       if not token:
           return jsonify({'message': 'Missing valid token'})
       try:
           data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
           current_user = AppUser.query.filter_by(id=data['id']).first()
       except jwt.ExpiredSignatureError:
           return jsonify({'message': 'Token has expired'})
       except jwt.InvalidTokenError:
           return jsonify({'message': 'Token is invalid'})
 
       return f(current_user, *args, **kwargs)
   return decorator'''

@bp.route('/register', methods=['POST'])
def register():
    db.session.query(AppUser).delete()
    db.session.commit()
    data = request.get_json() 
    newUser = AppUser(username=data['username'], email=data['email'])
    newUser.set_password(data['password'])
    db.session.add(newUser)
    db.session.commit()

    return jsonify({'message': 'Account created succesfully'})

@bp.route('/login', methods=['POST'])
def login():
    auth = request.get_json() 
    if not auth or 'email' not in auth or 'password' not in auth: 
       return make_response('Verification failed', 401, {'Authentication': 'Login required"'})   
 
    user = AppUser.query.filter_by(email=auth['email']).first()  
    if user.verify_password(auth['password']):
       token = jwt.encode({'id' : user.id, 'exp' : datetime.now(timezone.utc) + timedelta(hours=1)}, current_app.config['SECRET_KEY'], "HS256")
       return jsonify({'token' : token})
 
    return make_response('Verification failed', 401, {'Authentication': 'Login required"'})   


@bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    newRevokedToken = RevokedToken(token=request.headers['x-access-tokens'])
    db.session.add(newRevokedToken)
    db.session.commit()
    return jsonify({'message': 'Successfully logged out'}), 200


@bp.route('/protected')
@token_required
def getUsers(current_user):
    users = AppUser.query.all()
    userList = []
    for user in users:
        user_info = {
            "id": user.id,
            "username": user.username,
            "email": user.email    
        }
        userList.append(user_info)
    return jsonify({'users': userList})


@bp.route('/tokens')
def getTokens():
    revokedTokens = RevokedToken.query.all()
    rtlist = []
    for rt in revokedTokens:
        rt_info = {
            "id": rt.id,
            "token": rt.token  
        }
        rtlist.append(rt_info)
    return jsonify({'revokedTokens': rtlist})
