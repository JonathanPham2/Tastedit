from .db import db, environment, SCHEMA, add_prefix_for_prod

from datetime import datetime

class Comment(db.Model):
    __tablename__= "comments"
    
    if environment == "production":
        __table_args__= {"schema":SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    dish_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("dishes.id")), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    #relationship
    user = db.relationship("User", back_populates="comments")

    dish = db.relationship("Dish", back_populates="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "dish_id":self.dish_id,
            "comment": self.comment,
            "user": self.user.to_dict(),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()

        }
