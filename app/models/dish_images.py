from .db import db, SCHEMA, environment, add_prefix_for_prod
from datetime import datetime

class DishImage(db.Model):
    __tablename__ = "dish_images"

    if environment == "production":
        __table_args__ = {"schema":SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    dish_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("dishes.id")), nullable=False)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationsip
    dish = db.relationship("Dish", back_populates='dish_images')

    def to_dict(self):
        return {
            "id": self.id,
            "dish_id": self.dish_id,
            "image_url": self.image_url


        }