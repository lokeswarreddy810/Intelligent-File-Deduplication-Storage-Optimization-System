from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password
)
from app.models.user import User
from app.repositories.user_repository import UserRepository


class AuthenticationError(Exception):
    pass


class UserAlreadyExistsError(Exception):
    pass


class AuthService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def register(
        self,
        email: str,
        password: str,
        full_name: str
    ) -> User:
        existing_user = self.repository.get_by_email(email)

        if existing_user:
            raise UserAlreadyExistsError("Email address is already registered")

        return self.repository.create(
            email=email,
            full_name=full_name,
            password_hash=hash_password(password)
        )

    def authenticate(
        self,
        email: str,
        password: str
    ) -> str:
        user = self.repository.get_by_email(email)

        if not user or not verify_password(password, user.password_hash):
            raise AuthenticationError("Invalid email or password")

        if not user.is_active:
            raise AuthenticationError("User account is inactive")

        return create_access_token(user.id)

    def get_user(self, user_id: str) -> User | None:
        return self.repository.get_by_id(user_id)