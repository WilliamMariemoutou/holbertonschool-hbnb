#!/bin/usr/python3


from app.models.base_model import BaseModel

class Review(BaseModel):
    """Simple Review class."""

    def __init__(self, text, rating, place, user):
        super().__init__()

        if not text:
            raise ValueError("Review text is required")

        if not isinstance(rating, int) or rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5")

        self.text = text
        self.rating = rating
        self.place = place
        self.user = user

        """Connect review to place"""
        place.reviews.append(self)
