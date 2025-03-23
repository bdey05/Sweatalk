from api import db, bcrypt
from sqlalchemy import Date, DateTime, Float, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, validates
from sqlalchemy.exc import SQLAlchemyError
import datetime 
import re 

class Ingredient(db.Model):
    id: Mapped[Integer] = mapped_column(Integer, primary_key=True)
    meal_id: Mapped[Integer] = mapped_column(Integer, db.ForeignKey('meal.id'), nullable=False)
    is_branded: Mapped[Boolean] = mapped_column(Boolean, nullable=False)
    #This will be the nix_item_id if the item is Branded or the food_name if the item is a Common food
    api_query: Mapped[String] = mapped_column(String(50), nullable=False)
    serving_qty: Mapped[Float] = mapped_column(Float, nullable=False)
    serving_unit: Mapped[String] = mapped_column(String(20), nullable=False)
    meal = db.relationship('Meal', back_populates='ingredients')
    
    
    
    
    

