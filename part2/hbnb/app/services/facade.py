#!/usr/bin/python3
"""
HBnBFacade class initializes and maintains references to the various services
and repositories required by the application
"""
from app.persistence.repository import InMemoryRepository
from app.models.user import User
from app.services.user_service import UserService
from app.services.place_service import PlaceService
from app.services.review_service import ReviewService
from app.services.amenity_service import AmenityService


class HBnBFacade:
    def __init__(self):
        """
        Initializes all repositories
        """
        self.user_service = UserService()
        self.place_service = PlaceService()
        self.review_service = ReviewService()
        self.amenity_service = AmenityService()

        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    # Placeholder method for creating a user
    def create_user(self, user_data):
        """
        Creates a new user and adds it to the repository
        """
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        """
        Retrieves a user by their id
        """
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        """
        retrieves a user by their email address
        """
        users = self.user_repo.get_by_attribute('email', email)
        if users:
            return users[0]
        return None


    # Placeholder method for fetching a place by ID
    #def get_place(self, place_id):
    #    place = self.place_repo.get(place_id)
    #    if place:
    #        place.reviews = self.review_repository.get_by_attribute('place_id', place_id)
    #    return place