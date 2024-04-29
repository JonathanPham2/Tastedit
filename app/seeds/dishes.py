from app.models import db, Dish, environment, SCHEMA
from sqlalchemy.sql import text


def seed_dishes():
    dishes= [ 
            Dish(
            user_id=1,
            restaurant_id=1,
            name="Spicy Vegan Pizza",
            spicy_level="medium",
            vegan=True,
            cuisine="Italian",
            protein_type="Planted-base",
            description="A delightful pizza topped with spicy vegan cheese and jalapenos.",
            price="Budget-friendly",
            recommended=True,
            rating=4,
       
    ),

        Dish(
            user_id=2,
            restaurant_id=2,
            name="Mild Chicken Curry",
            spicy_level="mild",
            vegan=False,
            cuisine="Thai",
            protein_type="Chicken",
            description="Tender chicken pieces in a creamy mild curry sauce.",
            price="Budget-friendly",
            recommended=False,
            rating=3,
       
    ),

        Dish(
            user_id=3,
            restaurant_id=3,
            name="No Spice Mango Sorbet",
            spicy_level="no spice",
            vegan=True,
            cuisine="French",
            description="Fresh mango sorbet, perfect for a hot day, completely spice free.",
            price="Moderate",
            recommended=True,
            rating=5,
        ),
        Dish(
        user_id=4,
        restaurant_id=1,
        name="Spicy Thai Green Curry",
        spicy_level="medium",
        vegan=False,
        cuisine="Thai",
        protein_type="Chicken",
        description="Aromatic and spicy green curry cooked with coconut milk, bamboo shoots, and basil.",
        price="Moderate",
        recommended=True,
        rating=5
    ),
    Dish(
        user_id=5,
        restaurant_id=2,
        name="Vegan Mushroom Risotto",
        spicy_level="no spice",
        vegan=True,
        cuisine="Italian",
        protein_type="Planted-base",
        description="Creamy risotto with wild mushrooms, garlic, and parsley, topped with vegan parmesan.",
        price="Moderate",
        recommended=True,
        rating=4
    ),
    Dish(
        user_id=6,
        restaurant_id=3,
        name="Grilled Salmon",
        spicy_level="mild",
        vegan=False,
        cuisine="American",
        protein_type="Fish",
        description="Perfectly grilled salmon served with a side of asparagus and lemon butter sauce.",
        price="Expensive",
        recommended=True,
        rating=5
    ),
    Dish(
        user_id=7,
        restaurant_id=4,
        name="Lamb Kebab",
        spicy_level="very spicy",
        vegan=False,
        cuisine="Middle Eastern",
        protein_type="Lamb",
        description="Juicy lamb kebabs marinated with middle eastern spices and served with tzatziki.",
        price="Budget-friendly",
        recommended=False,
        rating=3
    ),
    Dish(
        user_id=8,
        restaurant_id=5,
        name="Classic Cheeseburger",
        spicy_level="no spice",
        vegan=False,
        cuisine="American",
        protein_type="Beef",
        description="A classic cheeseburger with lettuce, tomato, pickles, and secret sauce.",
        price="Budget-friendly",
        recommended=True,
        rating=4
    ),
    Dish(
        user_id=9,
        restaurant_id=6,
        name="Pork Ramen",
        spicy_level="medium",
        vegan=False,
        cuisine="Japanese",
        protein_type="Pork",
        description="Rich and flavorful pork broth with noodles, soft-boiled egg, green onions, and slices of pork belly.",
        price="Moderate",
        recommended=True,
        rating=5
    )
    ]

    db.session.add_all(dishes)
    db.session.commit()

def undo_dishes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.dishes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM dishes"))
        
    db.session.commit()
