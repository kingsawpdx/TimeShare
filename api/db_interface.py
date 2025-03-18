import os

from supabase import (
    create_client as supabase_create_client, 
    Client as SupabaseClient,
)

from postgrest.base_request_builder import APIResponse

class DBInterface:
    """
    DBInterface is an abstraction layer for the backend making queries to the database
    """

    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")
        self.supabase: SupabaseClient = supabase_create_client(url,key)
        
    
    def get_user_events(self, user_id: str) -> APIResponse:
        """
        Returns all of the events in the events database associated with the User

        :param user_id: ID of the User in the database
        :returns: An APIResponse of all of the events associated with a User
        :raises APIError: Raised if supabase connection fails to execute the command
        """
        print(f"Getting events for {user_id}")
        return (
            self.supabase.table("events")
                .select("*")
                .eq("userId", user_id)
                .execute()
        )
    

    def insert_events(self, events: dict|list) -> APIResponse:
        """
        Attempts to insert all passed events into the database

        :param events: Either a single event as a dict, or a list of events
        :returns: an APIResponse from the database operation
        :raises APIError: Raised if the API raised an error
        """

        # convert single event to a list 
        if isinstance(events, dict):
            events = [events]

        response = (
            self.supabase.table("events")
                .insert([
                    {
                        "title": event.get("title"),
                        "userId": event.get("userId"),
                        "start": event.get("start"),
                        "end": event.get("end")
                    } 
                    for event in events
                ])
                .execute()
        )

    def update_event(self, event_id: str, event: dict) -> APIResponse:
        """
        Updates an event
        :param event_id: ID of the event to update
        :param event: Data to update the event with
        :returns: an APIResponse from the database operation
        :raises APIError: Raised if the API raised an error
        """
        return (
            self.supabase.table("events")
                .update({
                    "title": event["title"],
                    "start": event["start"],
                    "end": event["end"]
                })
                .eq("id", event_id)
                .execute()
        )
    
    def delete_event(self, event_id: str) -> APIResponse:
        """
        Deletes an event
        :param event_id: ID of the event to delete
        :returns: an APIResponse from the database operation
        :raises APIError: Raised if the API raised an error
        """
        return (
            self.supabase.table("events")
                .delete()
                .eq("id", event_id)
                .execute()
        )
    
    def get_single_user(self, user_id: str) -> APIResponse:
        """
        Retrieves the data for a single User
        
        :param user_id: ID of the User
        :returns: an APIResponse containing the User data
        :raises APIError: Raised if the API raised an error
        """
        return (
            self.supabase.table("users")
                .select("*")
                .eq("userId", user_id)
                .execute()
        )
    
    def get_all_users(self):
        """
        Retrieves the data for all Users
        
        :returns: an APIResponse containing all User data
        :raises APIError: Raised if the API raised an error
        """
        return (
            self.supabase.table("users")
                .select("*")
                .execute()
        )
    
    def get_user_data(self, user_id: str | None):
        if user_id is None:
            return self.get_all_users()
        else:
            return self.get_single_user(user_id)
    
    def insert_user(
            self,
            user_id: str,
            name: str,
            email: str,
            event_color: str,
            profile_image):
        return (
            self.supabase.table("users")
                .insert({
                    "userId": user_id,
                    "name": name,
                    "email": email,
                    "eventColor": event_color,
                    "linkedUsers": "{}",
                    "profileImage": profile_image,
                })
                .execute()
        )
    
    def update_user(self):
        pass