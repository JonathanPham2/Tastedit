from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Dish, db, DishImage
from app.forms import AddDishForm
from app.aws import upload_file_to_s3, get_unique_filename, remove_file_from_s3
# from app import socketio


from flask_login import login_required, current_user

dish_routes = Blueprint('dishes', __name__)

@dish_routes.route("/", methods=["GET"])
def get_all_dishes():
    dishes = Dish.query.all()
    return jsonify([dish.to_dict() for dish in dishes])


@dish_routes.route("/<int:id>", methods=["GET"])
def get_dish_by_id(id):
    dish = Dish.query.get(id)
    return jsonify(dish.to_dict())


@dish_routes.route("/new", methods=["POST"])
@login_required
def post_dish():
    form = AddDishForm()
    # must grab the token from rquest cookie otherwise can  not validate
    form['csrf_token'].data = request.cookies["csrf_token"]  
    user_id = current_user.id


    if form.validate_on_submit():
        print("---------------",form)
        # print("---------------------------------", form['restaurant_id'])
    #    take out csrf and image field because our dish model dont have it
        excluded_fields =["csrf_token", "images"]
        dish_data = {key: value for key, value in form.data.items() if key not in excluded_fields }
        new_dish = Dish(**dish_data)
        new_dish.user_id = user_id
        for image in form.images.data:
            image.filename  = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)
            print("this is the error",upload)
            if "url" not in upload:
                # if there is not url key meaning uploading fail
                return {"message": "Upload to aws failed"}
            url = upload["url"]
            new_dish_image = DishImage(image_url = url)
            new_dish.dish_images.append(new_dish_image)
        #  commit to database
        db.session.add(new_dish)
        db.session.commit()
        # socketio.emit("dish_added", new_dish.to_dict(), broadcast=True)
        return jsonify(new_dish.to_dict()),201
    else:
        return form.errors, 400
    
@dish_routes.route("/<int:id>", methods=["PUT"])
@login_required
def edit_dish(id):
    #  query dish base on theid
    dish_to_update =  Dish.query.get(id)
    
    if not dish_to_update:
        return {"errors":"Dish not found"}, 404
    
    if current_user.id != dish_to_update.user_id:
        return {"errors": "You are not the owner of this dish post"}, 401
    
    form = AddDishForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        #  field that can update in dish model
        fields_to_update= ["name","cuisine", "spicy_level", "vegan", "description", "price", "recommended", "rating"]
        # loop through the fields_to_update and if there is a field in the form update that field for dish 
        for field in fields_to_update:
            if field in form.data:
                # using set attribute method to update 
                setattr(dish_to_update, field, form.data[field])
        images_to_update = form.images.data

        if images_to_update:
            #  then delete that image from DishImage table 
            DishImage.query.filter_by(dish_id = dish_to_update.id).delete()
            db.session.commit()
            #  for now  i will just delete all the image that exist if user choose to update image lol xD
            for dish_image in dish_to_update.dish_images:
                remove_file_from_s3(dish_image.url) # remove image that store in aws
            for image in images_to_update:
                image.filename = get_unique_filename(image)
                new_image_upload = upload_file_to_s3(image)
                print(new_image_upload)
                if "url" not in new_image_upload:
                    return {"errors": "failed to upload new image on aws"}
                url = new_image_upload["url"]
                updated_dish_image = DishImage(image_url=url)
                dish_to_update.dish_images.append(updated_dish_image)
        
        # commit to database
        db.session.commit()
        return jsonify(dish_to_update.to_dict()),200
    

    print(form.errors,"eerororo=----------------------------------")
    return form.errors, 500

       

                
@dish_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_dish(id):
    dish_to_delete = Dish.query.get(id)
    if not dish_to_delete:
        return {"errors":"No dish post found"}, 404
    if dish_to_delete.user_id != current_user.id:
        return {"erros": "You are not the owner of this dish post"}, 401
    # if not hititng any above condition will delete the dish
    db.session.delete(dish_to_delete)
    # commit to database
    db.session.commit()
    #  return id just for manipulate in the client side purpose
    return jsonify({"id":id}), 200


@dish_routes.route("/current", methods=["GET"])
@login_required
def get_user_dishes():
    dishes = Dish.query.filter(Dish.user_id == current_user.id).all()
    return jsonify([dish.to_dict() for dish in dishes])

