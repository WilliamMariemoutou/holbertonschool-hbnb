#!/usr/bin/python3


from app.models.base_model import BaseModel

class Amenity(BaseModel):
    """Simple Amenity class."""

    def __init__(self, name):
        super().__init__()

        if not name:
            raise ValueError("Amenity name is required")

        self.name = name

        """list of places that have this amenity"""
        self.places = []
