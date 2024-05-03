from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Comment, db
from app.socket import socketio
from app.forms import CommentForm

comments_routes = Blueprint("commets", __name__)

@comments_routes.route("/<int:id>/comments", methods=["POST"])
def post_comment(id):
    form = CommentForm()
    # need csrf token
    form["csrf_token"].data = request.cookies["csrf_token"]
    comment_data = form.data["comment"]
    if form.validate_on_submit():
        new_comment = Comment(
            user_id= current_user.id,
            dish_id =id,
            comment = comment_data
        )    
        db.session.add(new_comment)
        db.session.commit()
        # socketio.emit("new_comment", new_comment.to_dict())
        return jsonify(new_comment.to_dict()),200
    else:
        return form.errors, 400
@comments_routes.route("/<int:id>/comments", methods=["GET"])
def get_comments(id):
    comments = Comment.query.filter(Comment.dish_id==id).all()
    return jsonify([comment.to_dict() for comment in comments]),200
    