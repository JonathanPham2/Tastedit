from flask_wtf import FlaskForm
from wtforms import SubmitField

class AddFavoriteForm(FlaskForm):
    Submit = SubmitField("add favorite")