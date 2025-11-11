#!/usr/bin/python3
"""
Initializes the Blueprint for API version 1.
"""
from flask import Blueprint


app_views = Blueprint('app_views', __name__, url_prefix='/api/v1')

from app.api.v1 import users, places, reviews, amenities
