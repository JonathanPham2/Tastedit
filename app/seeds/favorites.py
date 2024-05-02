from app.models import db, Favorite, environment, SCHEMA
from sqlalchemy.sql import text


def seed_favorite():
    favorites_data = [
        {"user_id": 1, "dish_id": 2},
        {"user_id": 1, "dish_id": 3},
        {"user_id": 2, "dish_id": 1},
        {"user_id": 3, "dish_id": 2},
    ]

    for fav in favorites_data:
        new_favorite = Favorite(
            user_id=fav["user_id"],
            dish_id=fav["dish_id"]
        )
        db.session.add(new_favorite)
        db.session.commit()

def undo_favorite():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM favorite"))
        
    db.session.commit()