from app.models import db, DishImage, environment, SCHEMA
from sqlalchemy.sql import text

def seed_dish_images():
    images = [
        DishImage(
            dish_id= 1,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/sweet-spicy-pizza-1.jpeg"
            
        ),
        DishImage(
                dish_id=2 ,
                image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/Chicken-Curry-1.jpeg"
                
        ),
        DishImage(
                dish_id=3 ,
                image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/Mango-Sorbet-with-Mint.jpg"
            
        ),
        DishImage(
                dish_id=4 ,
                image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/dish-pictures/green-curry.jpeg"
            
        ),
        DishImage(
                dish_id=5 ,
                image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/dish-pictures/Easy-Vegan-Mushroom-Risotto.png"
            
        ),

        DishImage(
                dish_id= 6,
                image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/dish-pictures/featured-grilled-salmon.jpeg"
            
        ),

        DishImage(
                dish_id= 7,
                image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/dish-pictures/1.jpg"
                
            ),
         DishImage(
            dish_id= 8,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/dish-pictures/cheeseburger-1.webp"
            
        ),
         DishImage(
            dish_id=9 ,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/dish-pictures/pork-ramen.jpeg"
            
        ),
   
    
            
    ]

    db.session.add_all(images)
    db.session.commit()

def undo_dish_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.dish_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM dish_images"))
        
    db.session.commit()