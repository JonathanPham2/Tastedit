from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Favorite, db
from app.forms import AddFavoriteForm



favorite_routes =  Blueprint("favorites", __name__)

@favorite_routes.route("/<int:id>", methods=["POST"])
@login_required
def post_favorite(id):
    form = AddFavoriteForm()
    form["csrf_token"].data = request.cookie["csrf_token"]
    if form.validate_on_submit():
        new_favorite = Favorite(
            user_id = current_user.id,
            dish_id = id
        )
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify(new_favorite.to_dict()), 200
    else:
        return form.errors, 400

@favorite_routes.routes("/<int:id>", methods=["DELETE"])
@login_required
def delete_favorite(id):
    favorite_to_delete = Favorite.query.get(id)
    if favorite_to_delete.user_id != current_user.id:
        return jsonify({"message": "Not authorize"}), 401
    
    db.session.delete(favorite_to_delete)
    db.session.commit()
    return jsonify(id), 200