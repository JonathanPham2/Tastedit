from models import db, add_prefix_for_prod, SCHEMA, environment
from datetime import datetime

from sqlalchemy import Enum

class Dish(db.Model):
    __tablename__ = "Dishes"
    # set the right table schema for production cause we using 1 databse for many application on render
    if environment == "production":
        __table_args = {"schema":SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("restaurants.id")), nullable=False)
    name = db.Column(db.String(255), nullable=False,  unique=True)
    # using Enum to define spicy levels 
    spicy_level = db.Column(Enum("no spice", "mild", "medium", "very spicy", name="spicy_level_types"), nullable=False)
    vegan = db.Column(db.Boolean, nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    recommended = db.Column(db.Boolean, nullable=False)
    rating = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    dish_images = db.relationship("Dish_Images", back_populates="dish", cascade="all, delete, delete-orphan")


    comments = db.relationship('Comment', back_populates='dish', cascade='all, delete, delete-orphan')
    user = db.relationship('User', back_populates='dishes')

    # join table relationship
    favorite = db.relationship('Favorite', back_populates='dish', cascade='all , delete, delete-orphan')


