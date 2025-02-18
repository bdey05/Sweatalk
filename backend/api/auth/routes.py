from flask import render_template 
from api.auth import bp 

@bp.route('/register')
def register():
    return ('<h2>Register Page</h2>')

@bp.route('/login')
def login():
    return ('<h2>Login Page</h2>')