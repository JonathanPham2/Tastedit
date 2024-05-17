from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Comment, db
from app.socket import socketio
from app.forms import CommentForm

comments_routes = Blueprint("commets", __name__)

@comments_routes.route("/<int:id>/comments", methods=["POST"])
@login_required
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
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 5, type=int)
    #  each load only conist of 5 comments 
    # query order from newest to oldest here
    comments_query = Comment.query.filter(Comment.dish_id==id).order_by(Comment.created_at.desc())
    comments_paginate = comments_query.paginate(page=page, per_page=per_page,error_out=False)
    comments = comments_paginate.items
    return jsonify([comment.to_dict() for comment in comments]),200

@comments_routes.route("/comments/<int:id>", methods=["PUT"])
@login_required
def edit_comment(id):
    form = CommentForm()
    comment_to_edit =  Comment.query.get(id)
    if not comment_to_edit:
        return jsonify({"errorMessage":"Comment not found"}), 404

    if comment_to_edit.user_id != current_user.id:
        return jsonify({"errorMessage":"Not authorize"}), 401 

    new_comment_data = form.data["comment"]

    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        comment_to_edit.comment = new_comment_data
        db.session.add(comment_to_edit)
        db.session.commit()
        return jsonify(comment_to_edit.to_dict()), 201
    else:
        return form.errors, 404

@comments_routes.route("/comments/<int:id>", methods=["DELETE"])
@login_required
def delete_comment(id):
    comment_to_delete = Comment.query.get(id)
    if current_user.id != comment_to_delete.user_id:
        return jsonify({"errorMessage": "Not Authorize"}), 401
    
    db.session.delete(comment_to_delete)
    db.session.commit()
    return jsonify(id), 200
    
