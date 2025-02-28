from flask import render_template 
from api.auth import bp 
from api.models.usermodel import AppUser
from api import db

@bp.route('/register')
def register():
    db.session.query(AppUser).delete()
    db.session.commit()
    newUser1 = AppUser(username="TestUser1", email="testuser1@gmail.com")
    newUser1.set_password("test123")
    newUser2 = AppUser(username="TestUser2", email="testuser2@gmail.com")
    newUser2.set_password("test123")
    db.session.add(newUser1)
    db.session.add(newUser2)
    db.session.commit()
    return ('<h2>Register Page</h2>')

@bp.route('/login')
def login():
    return ({'name': 'Bob', 'age': 47, 'height': 181})