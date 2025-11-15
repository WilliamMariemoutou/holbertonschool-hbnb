#!/bin/usr/python3

from app.models.base_model import BaseModel

class User(BaseModel):
    """Simple User class."""

    def __init__(self, first_name, last_name, email, is_admin=False):
        super().__init__()

        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.is_admin = is_admin

        # A user can have many places
        self.places = []

        # basic checks
        if not first_name:
            raise ValueError("first_name is required")
        if not last_name:
            raise ValueError("last_name is required")
        if not email or "@" not in email:
            raise ValueError("A valid email is required")

    def add_place(self, place):
        """Add a place to the user."""
        if place not in self.places:
            self.places.append(place)
            self.save()
