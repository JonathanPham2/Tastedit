from .db import db, environment, SCHEMA

from datetime import datetime

class Restaurant(db.Model):
    __tablename__= "restaurants"
    if environment == "production":
        __table_args__={"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    state = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    street = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text(), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)

    # relationship 
    dishes = db.relationship("Dish", back_populates="restaurant")

def to_dict(self):
    return {
        "id":self.id,
        "name": self.name,
        "state": self.state,
        "city": self.city,
        "street": self.street,
        "description": self.description,
        "created_at": self.created_at
    }

    