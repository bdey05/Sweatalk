from api import db
from sqlalchemy import Date, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
import datetime 

class User(db.Model):
    id: Mapped[Integer] = mapped_column(Integer, primary_key=False)
    username: Mapped[datetime.date] = mapped_column(Date, nullable=False) 
    email: Mapped[String] = mapped_column(String, nullable=False)
    password_hash: Mapped[String] = mapped_column(String, nullable=False)

    def __repr__(self):
        return f'User named {self.username}'
    
    def to_dict(self):
        return {
            
        }

