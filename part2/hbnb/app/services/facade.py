from app.models.user import User
from app.persistence.repository import InMemoryRepository

class HBnBFacade:
    """Simple facade to manage users."""

    def __init__(self):
        # Create a repository to store user objects
        self.user_repo = InMemoryRepository()
        

    def create_user(self, user_data):
        """
        Create a new user and save it in the repository.

        user_data: dict containing 'first_name', 'last_name', 'email'
        returns: User object
        """
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        """
        Retrieve a user by their ID.

        user_id: string UUID
        returns: User object or None if not found
        """
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        """
        Retrieve a user by email.

        email: string
        returns: User object or None if not found
        """
        return self.user_repo.get_by_attribute('email', email)

    def get_all_users(self):
        """
        Retrieve all users.

        returns: list of User objects
        """
        return self.user_repo.list_all()

    def update_user(self, user_id, data):
        """
        Update a user by ID with provided data.

        user_id: string UUID
        data: dict of attributes to update
        returns: updated User object or None if user not found
        """
        user = self.get_user(user_id)
        if not user:
            return None
        user.update(data)
        return user
