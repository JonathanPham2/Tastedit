from app.models import db, DishImage, environment, SCHEMA
from sqlalchemy.sql import text

def seed_dish_images():
    image1 = DishImage(
            dish_id= 1,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/sweet-spicy-pizza-1.jpeg"
            
        )
    image2 = DishImage(
            dish_id=1 ,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/sweet-spicy-pizza-2.jpeg"
            
        )
    image3 = DishImage(
            dish_id=1 ,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/sweet-spicy-pizza-3.jpeg"
            
        )
    image4 = DishImage(
            dish_id=1 ,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/sweet-spicy-pizza-4.jpeg"
            
        )
    image5 = DishImage(
            dish_id=2 ,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/Chicken-Curry-1.jpeg"
            
        )
    image6 = DishImage(
            dish_id= 2,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/Chicken-Curry-Recipe-2.jpeg"
            
        )
    image7 = DishImage(
            dish_id= 2,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/Chicken-Curry-Recipe-3-.jpeg"
            
        )
    image8 = DishImage(
            dish_id= 2,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/Chicken-Curry-Recipe-4.jpeg"
            
        )
    image9 = DishImage(
            dish_id=3 ,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/mango_sorbet-1.jpeg"
            
        )
    image10 = DishImage(
            dish_id= 3,
            image_url="https://tastedit-bucket.s3.amazonaws.com/project-pictures/mango_sorbet4-2.jpeg"
            
        )

    db.session.add_all([image1, image2,image3,image4,image5,image6,image7,image8,image9,image10,])
    db.session.commit()

def undo_dish_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.dish_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM dish_images"))
        
    db.session.commit()