from functools import wraps
from flask import request, jsonify, current_app, make_response
from api.auth import bp 
from api.models.usermodel import AppUser
from api.models.revokedtoken import RevokedToken
from api.helpers import token_required
from api import db
import jwt 
from datetime import datetime, timedelta, timezone

@bp.route('/register', methods=['POST'])
def register():
    #db.session.query(AppUser).delete()
    #db.session.commit()
    data = request.get_json() 
    if AppUser.query.filter_by(email=data['email']).first():
        return make_response(jsonify({'error': 'User with this email already exists'}), 400)
    if AppUser.query.filter_by(username=data['username']).first():
        return make_response(jsonify({'error': 'User with this username already exists'}), 400)
    newUser = AppUser(username=data['username'], email=data['email'])
    newUser.set_password(data['password'])
    db.session.add(newUser)
    db.session.commit()
    user = AppUser.query.filter_by(email=data['email']).first()  
    token = jwt.encode({'id' : user.id, 'exp' : datetime.now(timezone.utc) + timedelta(hours=1)}, current_app.config['SECRET_KEY'], "HS256")
    return jsonify({'token': token})

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
#@token_required
def getUsers():
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


#Helper route during development to clear all database tables
@bp.route('/cleardb')
def clearDB():   
    AppUser.query.delete()
    RevokedToken.query.delete()
    db.session.commit()
    return jsonify({'Clear': 'Database cleared'})