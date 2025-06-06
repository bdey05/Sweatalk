from api import db, bcrypt
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, validates
from sqlalchemy.exc import SQLAlchemyError
import re


class AppUser(db.Model):
    id: Mapped[Integer] = mapped_column(Integer, primary_key=True)
    username: Mapped[String] = mapped_column(String(30), unique=True, nullable=False)
    email: Mapped[String] = mapped_column(String(100), unique=True, nullable=False)
    age: Mapped[Integer] = mapped_column(Integer, unique=False, nullable=False)
    weight: Mapped[Integer] = mapped_column(Integer, unique=False, nullable=False)
    height: Mapped[Integer] = mapped_column(Integer, unique=False, nullable=False)
    password_hash: Mapped[String] = mapped_column(String(256), nullable=False)

    meals = db.relationship("UserMeal", back_populates="user")

    @validates("email")
    def validate_email(self, key, emailaddress):
        regex = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
        if not (re.fullmatch(regex, emailaddress)):
            raise SQLAlchemyError("Email address is not valid")
        return emailaddress

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "age": self.age,
            "weight": self.weight,
            "height": self.height,
        }
