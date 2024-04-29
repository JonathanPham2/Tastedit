"""empty message

Revision ID: 3d16e519e024
Revises: 64d5135907d7
Create Date: 2024-04-27 21:15:19.356583

"""
from alembic import op
import sqlalchemy as sa
import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '3d16e519e024'
down_revision = '64d5135907d7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('dishes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('cuisine', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('protein_type', sa.Enum('Beef', 'Chicken', 'Lamb', 'Fish', 'Pork', 'Planted-base'), nullable=True))
        batch_op.alter_column('price',
               existing_type=sa.NUMERIC(),
               type_=sa.Enum('Budget-friendly', 'Moderate', 'Expensive'),
               nullable=True)
    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('dishes', schema=None) as batch_op:
        batch_op.alter_column('price',
               existing_type=sa.Enum('Budget-friendly', 'Moderate', 'Expensive'),
               type_=sa.NUMERIC(),
               nullable=False)
        batch_op.drop_column('protein_type')
        batch_op.drop_column('cuisine')

    # ### end Alembic commands ###