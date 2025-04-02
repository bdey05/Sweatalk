from api import db, bcrypt
from sqlalchemy import Date, DateTime, Float, Integer, String, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, validates
from sqlalchemy.exc import SQLAlchemyError
import datetime 
import re 

class Ingredient(db.Model):
    id: Mapped[Integer] = mapped_column(Integer, primary_key=True)
    name: Mapped[String] = mapped_column(String(75), nullable=False)
    meal_id: Mapped[Integer] = mapped_column(Integer, db.ForeignKey('meal.id'), nullable=False)
    fdc_id: Mapped[String] = mapped_column(Integer, nullable=False)
    selected_serving_unit: Mapped[String] = mapped_column(String(100), nullable=False) 
    selected_serving_qty: Mapped[Float] = mapped_column(Float, nullable=False) 
    
    available_units: Mapped[dict] = mapped_column(JSON, nullable=False)

    meal = db.relationship('Meal', back_populates='ingredients')
    
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "meal_id": self.meal_id,
            "fdc_id": self.fdc_id,
            "selected_serving_unit": self.selected_serving_unit,
            "selected_serving_qty": self.selected_serving_qty,
            "available_units": self.available_units 
        }
    
    

