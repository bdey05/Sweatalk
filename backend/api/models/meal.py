from api import db, bcrypt
from sqlalchemy import Date, DateTime, Float, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, validates
from sqlalchemy.exc import SQLAlchemyError
import datetime 
import re 

class Meal(db.Model):
    id: Mapped[Integer] = mapped_column(Integer, primary_key=True)
    name: Mapped[String] = mapped_column(String(100), nullable=False)
    calories: Mapped[Integer] = mapped_column(Integer, nullable=False)
    protein: Mapped[Integer] = mapped_column(Integer, nullable=False)
    carbohydrates: Mapped[Integer] = mapped_column(Integer, nullable=False)
    fat: Mapped[Integer] = mapped_column(Integer, nullable=False)
    is_saved: Mapped[Boolean] = mapped_column(Boolean, nullable=False)
    ingredients = db.relationship('Ingredient', back_populates='meal')
    user_meals = db.relationship('UserMeal', back_populates='meal')
    
    
