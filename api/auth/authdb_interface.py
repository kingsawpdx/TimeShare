from tinydb import Query, TinyDB
import argon2 as a2
from .user import User
from .exceptions import *
from .password_reqs import validate_password

class AuthDB:
    """
    Creates an instance of AuthDB
    @return: AuthDB instance
    """
    def __init__(self):
        self.db = TinyDB('auth-db.json')
        self.ph = a2.PasswordHasher()

    """
    Verifies a user's password
    @param user: auth.user.User instance
    @param skip_password_validation: Optional: skips password validation step
    @return: True on successful verification
    @raises auth.exceptions.NoUserExistsError(name): When no user with 'name' exists in the database
    @raises argon2.exceptions.VerifyMismatchError: When password fails to match stored password's hash
    @raises argon2.exceptions.InvalidHashError: When stored hash is clearly not valid (Needs support)
    @raises argon2.exceptions.VerificationError: Verification fails for other reasons
    """
    def verify( self, user: User ):
        query = Query()
        user_found = self.db.search(query.name == user.name)
        # if user does not exist raise an exception
        if len(user_found) == 0:
            raise NoUserExistsError(user)
        
        return self.ph.verify(user_found[0]["passhash"], user.password)

    """
    Creates a new user with a password
    @param user: auth.user.User instance
    @return: True on successful creation of user
    @raises auth.exceptions.UserExistsError: When user with user.name already exists
    @raises argon2.exceptions.HashingError: On hashing error
    """
    def create_user_with_password( self, user: User ):
        query = Query()

        # if user exists raise an exception
        if len(self.db.search(query.name == user.name)) != 0:
            raise UserExistsError(user)
        
        passhash = self.ph.hash(user.password)
        self.db.insert({"name": user.name, "passhash": passhash})
        return True
        

if __name__ == "__main__":
    print("this is", __file__)
    print("it contains the interface for the authentication interface")