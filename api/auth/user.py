from .password_reqs import validate_password
from dataclasses import dataclass

"""
The User class is an immutable class which contains a valid password
"""
@dataclass(frozen=True)
class User:
    name: str
    password: str
    is_password_valid: bool = False

    def __post_init__(self, name, password):
        object.__setattr__(self, 'is_password_valid', validate_password(password))