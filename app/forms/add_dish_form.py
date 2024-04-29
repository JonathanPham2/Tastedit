from flask_wtf import FlaskForm
from wtforms import StringField,FloatField, BooleanField, TextAreaField, SelectField, MultipleFileField
from wtforms.validators import DataRequired, InputRequired, NumberRange
from flask_wtf.file import FileAllowed
from app.aws import ALLOWED_EXTENSIONS





class AddDishForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    spicy_level = SelectField("Spicy level", choices=[("no spice", "No Spice"), ("mild", "Mild"), ("medium", "Medium"), ("very spicy", "Very Spcy")],validators=[DataRequired()])
    vegan = BooleanField("Vegan",validators=[InputRequired()])
    cuisine = StringField("Cuisine", validators=[DataRequired()])
    protein_type = SelectField("Protein Type", choices=[("Beef", "Beef"), ("Chicken","Chicken"), ("Lamb", "Lamb"), ("Fish","Fish"), ("Pork", "Pork"), ("Planted-base", "Planted-base")], validators=[DataRequired()])
    description = TextAreaField("Description", validators=[DataRequired()])
    price = SelectField("Price", choices=[("Budget-friendly", "Budget-friendly"), ("Moderate", "Moderate"),("Expensive", "Expensive")])
    recommended = BooleanField("Recommended", validators=[InputRequired()])
    rating = FloatField("Rating", validators=[DataRequired(), NumberRange(min= 1, max=5, message="Rating must be between 1 to 5")])
    images = MultipleFileField(validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])