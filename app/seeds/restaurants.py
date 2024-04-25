from app.models import db, Restaurant, environment, SCHEMA
from sqlalchemy.sql import text

def seed_restaurants():
    restaurant1 = Restaurant(
        name="The Pizza Parlor",
        state="California",
        city="San Francisco",
        street="255 Dough Street",
        description="Home to artisan pizzas with a creative twist on traditional toppings, baked in a wood-fired oven.",
        
    )

    restaurant2 = Restaurant(
        name="Curry Corner",
        state="Texas",
        city="Houston",
        street="502 Spice Route",
        description="Offering a variety of authentic Indian curries, expertly prepared with traditional spices and fresh ingredients.",
       
    )

    restaurant3 = Restaurant(
        name="Sorbet Shack",
        state="Florida",
        city="Orlando",
        street="88 Tropical Lane",
        description="A refreshing stop for homemade sorbets and ice creams, specializing in tropical and exotic fruit flavors.",
       
    )

    db.session.add(restaurant1)
    db.session.add(restaurant2)
    db.session.add(restaurant3)
    db.session.commit()

def undo_restaurants():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.restaurants RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM restaurants"))
        
    db.session.commit()