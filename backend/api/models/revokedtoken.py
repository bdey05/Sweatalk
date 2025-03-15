from api import db
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

class RevokedToken(db.Model):
    id: Mapped[Integer] = mapped_column(Integer, primary_key=True)
    token: Mapped[String] = mapped_column(String, nullable=False, unique=True)
    


