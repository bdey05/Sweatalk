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
    serving_qty: Mapped[Float] = mapped_column(Float, nullable=False)
    is_saved: Mapped[Boolean] = mapped_column(Boolean, nullable=False)
    ingredients = db.relationship('Ingredient', back_populates='meal')
    user_meals = db.relationship('UserMeal', back_populates='meal')
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "calories": self.calories,
            "protein": self.protein,
            "carbohydrates": self.carbohydrates,
            "fat": self.fat,
            "serving_qty": self.serving_qty,
            "is_saved": self.is_saved,
            "ingredients": [ing.to_dict() for ing in self.ingredients]
        }
