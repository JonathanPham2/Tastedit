from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Restaurant, db



restaurant_routes = Blueprint("restaurants", __name__)

@restaurant_routes.route("/", methods=["GET"])
def get_all_restaurants():
    restaurants =  Restaurant.query.all()
    print("----------------",restaurants)

    return jsonify([restaurant.to_dict() for restaurant in restaurants])

