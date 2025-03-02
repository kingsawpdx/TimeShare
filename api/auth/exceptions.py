class InvalidPasswordError(Exception):
    pass

class NoUserExistsError(Exception):
    pass

class UserExistsError(Exception):
    pass

class SessionExpiredError(Exception):
    pass