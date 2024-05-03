from app.models import db, Comment, environment, SCHEMA
import random
from sqlalchemy.sql import text
from faker import Faker

def seed_comments():
    fake = Faker()
    for dish_id in range(1, 10):
        for user_id in range (1,4):
            comment_text = fake.sentence(nb_words=10, variable_nb_words=True, ext_word_list=None)
            new_comment = Comment(
                user_id = user_id,
                dish_id = dish_id,
                comment = comment_text
            )
            db.session.add(new_comment)

    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
        
    db.session.commit()
