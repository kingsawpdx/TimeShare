from tinydb import Query, TinyDB
from .user import User
from .exceptions import *
import secrets, time

# Idle timeout is 30 minutes
SESSION_IDLE_TIMEOUT = 60 * 30

class SessionDB:
    def __init__(self):
        self.db = TinyDB('sessions.json')

    def new_session(self, username):
        new_session_key = secrets.token_hex(16)
        expires = int(time.time()) + SESSION_IDLE_TIMEOUT

        query = Query()
        self.db.upsert(
            {
                "username": username, 
                "key": new_session_key,
                "expires": expires
            },
            query.username == username
        )

        return new_session_key
    
    def validate(self, username, key):
        query = Query()
        user_found = self.db.search(query.username == username)
        # if user does not exist raise an exception
        if len(user_found) == 0:
            return False
        
        if key != user_found[0]["key"]:
            return False

        expires = user_found[0]["expires"] + SESSION_IDLE_TIMEOUT
        self.db.upsert(
            {
                "username": username, 
                "key": key,
                "expires": expires
            },
            query.username == username
        )

        return True