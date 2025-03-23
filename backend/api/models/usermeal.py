from api import db, bcrypt
from sqlalchemy import Date, DateTime, Float, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, validates
from sqlalchemy.exc import SQLAlchemyError
import datetime 
import re 

class UserMeal(db.Model):
    id: Mapped[Integer] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Integer] = mapped_column(Integer, db.ForeignKey('app_user.id'), nullable=False)
    meal_id: Mapped[Integer] = mapped_column(Integer, db.ForeignKey('meal.id'), nullable=False)
    serving_qty: Mapped[Float] = mapped_column(Float, nullable=False)
    date: Mapped[Date] = mapped_column(Date, nullable=False)
    user = db.relationship('AppUser', back_populates='meals')
    meal = db.relationship('Meal', back_populates='user_meals')
   
    
    

