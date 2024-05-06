from .db import db, add_prefix_for_prod, SCHEMA, environment
from datetime import datetime

from sqlalchemy import Enum

class Dish(db.Model):
    __tablename__ = "dishes"
    # set the right table schema for production cause we using 1 databse for many application on render
    if environment == "production":
        __table_args__ = {"schema":SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("restaurants.id")), nullable=False)
    name = db.Column(db.String(255), nullable=False,  unique=True)
    # using Enum to define spicy levels 
    spicy_level = db.Column(Enum("no spice", "mild", "medium", "very spicy", name="spicy_level_types"), nullable=False)
    vegan = db.Column(db.Boolean, nullable=False)
    cuisine = db.Column(db.String(50), nullable=False)
    protein_type = db.Column(Enum("Beef", "Chicken", "Lamb", "Fish", "Pork", "Planted-base", name="protein_type"))
    description = db.Column(db.Text, nullable=False)
    price = db.Column(Enum("Budget-friendly", "Moderate", "Expensive", name="price"))
    recommended = db.Column(db.Boolean, nullable=False)
    rating = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    dish_images = db.relationship("DishImage", back_populates="dish", cascade="all, delete, delete-orphan")
    restaurant = db.relationship("Restaurant", back_populates="dishes")

    comments = db.relationship('Comment', back_populates='dish', cascade='all, delete, delete-orphan')
    user = db.relationship('User', back_populates='dishes')
 
    # join table relationship
    favorites = db.relationship('Favorite', back_populates='dish', cascade='all , delete, delete-orphan')

    def to_dict(self):
        return {
            "id":self.id,
            "user_id": self.user_id,
            "restaurant_id": self.restaurant_id,
            "name" : self.name,
            "spicy_level": self.spicy_level,
            "vegan":self.vegan,
            "cuisine": self.cuisine,
            "protein_type": self.protein_type,
            "description": self.description,
            "price": self.price,
            "recommended": self.recommended,
            "rating": self.rating,
            "restaurant": self.restaurant.to_dict(),
            "dish_images": [dish_image.to_dict() for dish_image in self.dish_images],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
               
        }



