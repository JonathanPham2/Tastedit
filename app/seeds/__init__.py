from flask.cli import AppGroup
from .users import seed_users, undo_users
from .dishes import seed_dishes, undo_dishes
from .restaurants import seed_restaurants, undo_restaurants
from .dish_images import seed_dish_images, undo_dish_images
from .favorites import seed_favorite, undo_favorite
from .comments import seed_comments, undo_comments
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_comments()
        undo_favorite()
        undo_dish_images()
        undo_dishes()
        undo_restaurants()
        undo_users()
    seed_users()
    seed_restaurants()
    seed_dishes()
    seed_dish_images()
    seed_favorite()
    seed_comments()

    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_restaurants()
    undo_dishes()
    undo_dish_images()
    undo_favorite()
    undo_comments()
    # Add other undo functions here
