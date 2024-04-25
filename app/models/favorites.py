from .db import db, environment, add_prefix_for_prod, SCHEMA
from datetime import datetime

class Favorite(db.Model):
    __tablename__=("favorites")
    if environment == "production":
        __table__args__= {"schema":SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    dish_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("dishes.id")), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    user = db.relationship("User", back_populates="favorites")

    dish = db.relationship("Dish", back_populates="favorites")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "dish_id": self.dish_id,
            "created_at": self.created_at
        }