from flask import Blueprint, request, jsonify
from app.models import Dish, db
#  need to add dish form late on

from flask_login import login_required, current_user

dish_routes = Blueprint('dishes', __name__)

@dish_routes.route("/", methods=["GET"])
def get_all_dishes():
    dishes = Dish.query.all()
    return jsonify([dish.to_dict() for dish in dishes])


@dish_routes.route("/new", methods=["POST"])
def post_dish():
    form = AddDishForm()
    # must grab the token from rquest cookie otherwise can  not validate
    form['csrf_token'].data = request.cookies["csrf_token"]  

    if form.validate_on_submit():
        return

    