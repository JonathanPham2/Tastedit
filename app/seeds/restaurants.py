from app.models import db, Restaurant, environment, SCHEMA
from sqlalchemy.sql import text

def seed_restaurants():
    # Existing restaurants
    restaurant1 = Restaurant(
        name="The Pizza Parlor",
        state="California",
        city="San Francisco",
        street="255 Dough Street",
        description="Home to artisan pizzas with a creative twist on traditional toppings, baked in a wood-fired oven."
    )

    restaurant2 = Restaurant(
        name="Curry Corner",
        state="Texas",
        city="Houston",
        street="502 Spice Route",
        description="Offering a variety of authentic Indian curries, expertly prepared with traditional spices and fresh ingredients."
    )

    restaurant3 = Restaurant(
        name="Sorbet Shack",
        state="Florida",
        city="Orlando",
        street="88 Tropical Lane",
        description="A refreshing stop for homemade sorbets and ice creams, specializing in tropical and exotic fruit flavors."
    )

    restaurant4 = Restaurant(
        name="Thai Delight",
        state="California",
        city="Los Angeles",
        street="1010 Lotus Avenue",
        description="Authentic Thai cuisine featuring vibrant flavors and fresh ingredients, famous for our spicy green curry."
    )

    restaurant5 = Restaurant(
        name="Mediterranean Magic",
        state="New York",
        city="New York",
        street="202 Olive Tree Blvd",
        description="Savor the flavors of the Mediterranean with a selection of kebabs and meze in a lively, family-friendly setting."
    )

    restaurant6 = Restaurant(
        name="River Fish Grill",
        state="Washington",
        city="Seattle",
        street="789 Rivermouth Road",
        description="Enjoy freshly caught seafood from the Pacific Northwest, cooked to perfection with a beautiful waterfront view."
    )

    restaurant7 = Restaurant(
        name="Burger Barn",
        state="Texas",
        city="Austin",
        street="345 Ranch Road",
        description="Classic American burgers with a modern twist, using locally sourced beef and fresh, organic ingredients."
    )

    restaurant8 = Restaurant(
        name="Tokyo Ramen House",
        state="Oregon",
        city="Portland",
        street="600 Sake Street",
        description="Traditional Japanese ramen with rich, flavorful broths and perfectly cooked noodles, right in the heart of Portland."
    )

    db.session.add_all([restaurant1, restaurant2, restaurant3, restaurant4, restaurant5, restaurant6, restaurant7, restaurant8])
    db.session.commit()


def undo_restaurants():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.restaurants RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM restaurants"))
        
    db.session.commit()