from flask_wtf import FlaskForm
from wtforms import StringField,FloatField, BooleanField, TextAreaField, SelectField, MultipleFileField
from wtforms.validators import DataRequired, InputRequired, NumberRange
from flask_wtf.file import FileAllowed
from app.aws import ALLOWED_EXTENSIONS





class AddDishForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    spicy_level = SelectField("Spicy level", choices=[("no spice", "No Spice"), ("mild", "Mild"), ("medium", "Medium"), ("very spicy", "Very Spcy")],validators=[DataRequired()])
    vegan = BooleanField("Vegan",validators=[InputRequired()])
    description = TextAreaField("Description", validators=[DataRequired()])
    price = FloatField("Price", validators=[DataRequired(),NumberRange(min= 0, message="Price must be greater than 0")])
    recommended = BooleanField("Recommended", validators=[InputRequired()] )
    rating = FloatField("Rating", validators=[DataRequired(), NumberRange(min= 1, max=5, message="Rating must be between 1 to 5")])
    images = MultipleFileField(validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])