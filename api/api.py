from flask import Flask, Request, Response, request, jsonify, abort, redirect, session, render_template, url_for
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from supabase import create_client, Client
import os
from flask_cors import CORS
from flask_session import Session
import random

from api.google_utility import (
    get_id_info,
    get_flow    
)

from api.config import Config

from .db_interface import DBInterface

database = DBInterface()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url,key)

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)

app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True 
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config['SERVER_NAME'] = 'http://localhost:8000/home'

app.config["SESSION_COOKIE_HTTPONLY"] = True 
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

FRONTEND_URL = "http://localhost:5173"

app.config.from_object(Config)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:5173/home"])
Session(app)

@app.before_request
def ensure_session_saved():
    session.modified = True

@app.after_request
def save_session(response):
    session.modified = True
    return response

#@app.route('/profileDetails', methods=['GET', 'POST', 'PATCH'])

def require_arg_for_method(request: Request, arg_name: str, *methods: tuple[str, ...]):
    """
    Guards against missing arguments for certain method calls

    :param request: flask.Request to fetch args from
    :param arg_name: Name of the argument to retrieve
    :param *methods: Methods to require argument for
    :returns: Requested arg, either None or the argument
    :raises Exception: If the argument is missing, but required for the method,
    contains a string stating "{arg_name} is required"
    """

    arg = request.args.get(arg_name)

    if any([request.method == method] for method in methods):
        if arg is None:
            raise Exception(f"{arg_name} is required")
    return arg

@app.route('/events/', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def events() -> Response:
    """
    Handles the events API calls

    :GET: Retrieves all of the events associated with user from the request arg "userId"
    :POST: Inserts the event(s) in the json data into the database
    :PATCH: Updates the event in the database specified with the "eventId" arg with the json data
    :DELETE: Deletes the event associated with the "eventId" arg
    """
    # arg 'userId', if used
    user_id: str | None = None

    # arg 'eventId', if used
    event_id: str | None = None

    # json data for events, 
    event_json: dict | list | None = None

    print("EVENTS QUERIED")

    # Get required arguments for each method
    try:
        user_id = require_arg_for_method(request, 'userId', 'GET')
        event_id = require_arg_for_method(request, 'eventId', 'PATCH', 'DELETE')

    except Exception as e:
        print(e)
        return jsonify({"error": e.args[0]}), 400

    print("Retrieved Required stuff")

    # If the method needs event data, retrieve it
    if request.method in ["POST", "PATCH"]:
        event_json = request.get_json()
        if not event_json:
            print("events required")
            return jsonify({"error": "event is required"}), 400


    if request.method == 'GET': 
        try:
            return database.get_user_events(user_id).data
        
        except Exception as error:
            return jsonify({"error": str(error)}), 500
    

    elif request.method == 'POST':
        try:
            response = database.insert_events(event_json)

            return jsonify(response.data), 200
        except Exception as error:
            return jsonify({"error:": str(error)}), 500


    elif request.method == 'PATCH':
        try:
            database.update_event(event_id, event_json)

        except Exception as error:
            return jsonify({"error:": str(error)}), 500
        return "Successfully updated event"
    

    elif request.method == 'DELETE':
        try:
            database.delete_event(event_id)
        except Exception as error:
            return jsonify({"error": str(error)}), 500
        return "Successfully deleted event"
    


@app.route('/users/', methods=['GET', 'POST', 'PATCH'])
def users():
    # arg 'userId', if used
    user_id: str | None = None

    # json data for user
    user_json: dict | None = None

    # Get required/optional arguments for each method
    try:
        print(f"Trying to get userId {request}")
        user_id = require_arg_for_method(request, 'userId', 'PATCH')
    except Exception as e:
        print(f"Failed {e}")
        return jsonify({"error": e.args}), 400
    
    if request.method == 'PATCH':
        user_json = request.get_json()
        if user_json is None:
            return jsonify({"error": "userUpdate and userId required"}), 400
    
    try:
        if request.method == 'GET':
            if user_id is not None:
                user = database.get_single_user(user_id).data
                if not user:
                    print(f"User not found {user_id}")
                    return jsonify({"error": "User not found"}), 404
                return jsonify({"user": user[0]}), 200
            
            else:
                users = database.get_all_users().data
                if not users:
                    return jsonify({"error": "Users not found"}), 404
                return jsonify({"users": users}), 200            


        elif request.method == 'POST':
            colors = ['DarkOrange', 'Crimson', 'ForestGreen', 'SkyBlue', 'Teal', 'Tomato', 'Violet']
            colorIndex = random.randrange(len(colors))

            user_data = request.get_json()
            
            print(user_data)

            database.insert_user(
                user_id         = user_data.get("userId"),
                name            = user_data.get("name"),
                email           = user_data.get("email"),
                event_color     = colors[colorIndex],
                profile_image   = user_data.get("profileImage")
            )

            return jsonify(
                { 
                    "message": "User added", 
                    "user": {
                        "userId":       user_data.get("userId"),
                        "name":         user_data.get("name"),
                        "email":        user_data.get("email"),
                        "profileImage": user_data.get("profileImage"),
                    }
                }
            ), 201
        
        elif request.method == 'PATCH':
            userUpdate = request.get_json()

            print("Received userId:", user_id)  # Debugging log
            print("Received userUpdate:", userUpdate)  # Debugging log
            
            response = (
                supabase.table("users")
                .update({
                        "name": userUpdate.get("name"),
                        "eventColor": userUpdate.get("eventColor"),
                        "profileImage": userUpdate.get("profileImage"),
                        "linkedUsers": userUpdate.get("linkedUsers"),
                        "email": userUpdate.get("email"),

                })
                .eq("userId", user_id)
                .execute()
            )
            print("Supabase response:", response)  # Debugging log

            return jsonify(response.data),200
        
    except Exception as error:
        print(f"Error in /users/ method={request.method}:", str(error)) # Debugging log
        return jsonify({"error": str(error)}), 500

    
@app.route("/login")
def login():
    try:
        authorization_url, state = get_flow().authorization_url()
        session["state"] = state
        session.modified = True

        return redirect(authorization_url)
    except Exception as error:
        print(f"Error occured in login: {error}")
        return redirect("/")
    
@app.route("/callback")
def callback():
    try:
        get_flow().fetch_token(authorization_response=request.url)

        if "state" not in session:
            print("Session state is missing!")
            return redirect('/login')  

        if not session["state"] == request.args["state"]:
            abort(500)  

        credentials = get_flow().credentials
        id_info = get_id_info(credentials)
        
        session["user_id"] = id_info.get("sub")
        session["name"] = id_info.get("name")
        session["profileImage"] = id_info.get("picture")
        session["email"] = id_info.get("email")

        session["credentials"] = {
                "token": credentials.token,
                "refresh_token": credentials.refresh_token,
                "token_uri": credentials.token_uri,
                "client_id": credentials.client_id,
                "client_secret": credentials.client_secret,
                "scopes": credentials.scopes,
            }

        return redirect(f"{FRONTEND_URL}/calendar?logged_in=true")
    except Exception as error:
        print(f"Error occured in callback: {error}")
        return redirect("/")
    
@app.route("/session")
def get_session():
    if "user_id" in session:
        return jsonify({
            "logged_in": True,
            "userId" : session["user_id"],
            "name" : session["name"],
            "profileImage": session['profileImage'],
            'email': session['email']

        })
    return jsonify({"logged_in": False}), 404

@app.route("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route("/googleEvents")
def get_events():
    if "credentials" not in session:
        return jsonify({"error": "User not authenticated"}), 401
    
    credentials_data = session["credentials"]
    credentials = Credentials(
        token=credentials_data["token"],
        refresh_token=credentials_data.get("refresh_token"),
        token_uri=credentials_data["token_uri"],
        client_id=credentials_data["client_id"],
        client_secret=credentials_data["client_secret"],
        scopes=credentials_data["scopes"],
    )
    try:
        
        startDate = "2025-02-01T00:00:00Z"
        endDate = "2026-02-28T23:59:59Z"

        service = build("calendar", "v3", credentials=credentials)

        events_result = service.events().list(
            calendarId="primary",
            timeMin=startDate,
            timeMax=endDate,
            singleEvents=True,
            orderBy="startTime",
        ).execute()

        events = events_result.get("items", [])
        return jsonify(events)
    except Exception as error:
        return jsonify({"error": str(error)}), 500


if __name__ == "__main__":
    app.run(port=8000, debug=True)