#!/usr/bin/python3
"""
Module for the User class.
"""
from models.base_model import BaseModel


class User(BaseModel):
    """
    Represents a user in the system.

    Attributes:
        email (str): The user's email address.
        password (str): The user's password.
        first_name (str): The user's first name.
        last_name (str): The user's last name.
        places (list): A list of Place instances owned by the user.
    """
    def __init__(self, *args, **kwargs):
        """Initializes a new User."""
        super().__init__(*args, **kwargs)
        self.email = ""
        self.password = ""
        self.first_name = ""
        self.last_name = ""
        self.places = []

    def add_place(self, place):
        """Adds a place to the user's list of owned places."""
        if place not in self.places:
            self.places.append(place)

