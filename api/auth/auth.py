from .user import User
from .authdb_interface import AuthDB
from .sessions_interface import SessionDB
from .exceptions import *
from argon2.exceptions import *

class Auth:
    """
    Creates an instance of Auth
    """
    def __init__(self):
        self.auth = AuthDB()
        self.session = SessionDB()

    """
    Attempts to login as 'user'
    @param user: A valid user with username and password
    @return: dict with at least a 'response' section containing a high-level response, and sessionkey on success
    """
    def attempt_login(self, user: User):
        if not user.is_password_valid:
            return {
                "response"   : "Invalid password",
                "sessionkey" : 0 
            }

        try:
            self.auth.verify(user)
        except NoUserExistsError as _:
            return {
                "response"   : "No user with that username exists",
                "sessionkey" : 0 
            }
        except VerifyMismatchError as _:
            return {
                "response"   : "Username and password do not match",
                "sessionkey" : 0 
            }
        except Exception as _:
            return {
                "response"   : "Something went wrong, please contact support",
                "sessionkey" : 0 
            }
        
        sessionkey = self.session.new_session(user.name)
        return {
            "response"   : "Success",
            "sessionkey" : sessionkey
        }
