from api import db
from sqlalchemy import Date, Integer
from sqlalchemy.orm import Mapped, mapped_column


class UserMeal(db.Model):
    id: Mapped[Integer] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Integer] = mapped_column(
        Integer, db.ForeignKey("app_user.id"), nullable=False
    )
    meal_id: Mapped[Integer] = mapped_column(
        Integer, db.ForeignKey("meal.id"), nullable=False
    )
    date: Mapped[Date] = mapped_column(Date, nullable=False)
    user = db.relationship("AppUser", back_populates="meals")
    meal = db.relationship("Meal", back_populates="user_meals")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "meal_id": self.meal_id,
            "date": self.date.isoformat(),
            "user": self.user.to_dict(),
            "meal": self.meal.to_dict(),
        }
