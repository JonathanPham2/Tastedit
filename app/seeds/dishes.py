from app.models import db, Dish, environment, SCHEMA
from sqlalchemy.sql import text
from decimal import Decimal

def seed_dishes():
    dish1 = Dish(
        user_id=1,
        restaurant_id=1,
        name="Spicy Vegan Pizza",
        spicy_level="medium",
        vegan=True,
        description="A delightful pizza topped with spicy vegan cheese and jalapenos.",
        price=Decimal("15.99"),
        recommended=True,
        rating=4,
       
    )

    dish2 = Dish(
        user_id=2,
        restaurant_id=2,
        name="Mild Chicken Curry",
        spicy_level="mild",
        vegan=False,
        description="Tender chicken pieces in a creamy mild curry sauce.",
        price=Decimal("12.50"),
        recommended=False,
        rating=3,
       
    )

    dish3 = Dish(
        user_id=3,
        restaurant_id=3,
        name="No Spice Mango Sorbet",
        spicy_level="no spice",
        vegan=True,
        description="Fresh mango sorbet, perfect for a hot day, completely spice free.",
        price=Decimal("7.00"),
        recommended=True,
        rating=5,
    )

    db.session.add(dish1)
    db.session.add(dish2)
    db.session.add(dish3)
    db.session.commit()

def undo_dishes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.dishes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM dishes"))
        
    db.session.commit()
