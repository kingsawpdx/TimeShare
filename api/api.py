from flask import Flask, request, jsonify, abort, redirect, session, render_template, url_for
import os
from supabase import create_client, Client
from flask_cors import CORS
from flask_session import Session
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from api.google_utility.auth import (
    get_id_info,
    get_flow    
)

from api.config import Config

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url,key)

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


@app.route('/events/', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def events():
    if request.method == 'GET': 
        user_id = request.args.get('userId')

        if not user_id:
            return jsonify({"error": "userId is require"}), 400
        
        try:
            response = (
                supabase.table("events")
                .select("*")
                .eq("userId", user_id)
                .execute()
            )

            events = response.data
            
        except Exception as error:
            return jsonify({"error": str(error)}), 500

        return events
    
    elif request.method == 'POST':
        events = request.get_json()

        if not events:
            return jsonify({"error": "event is required"}), 400
        
        try:
            response = (
                supabase.table("events")
                .insert([
                    {
                        "title": event["title"],
                        "userId": event["userId"],
                        "start": event.get("start"),
                        "end": event.get("end")
                    } 
                    for event in events
                ])
                .execute()
            )

            return jsonify({"message": "Successfully added events", "count": len(events)})
    
        except Exception as error:
            return jsonify({"error:": str(error)}), 500

    elif request.method == 'PATCH':
        eventId = request.args.get('eventId')
        updateEvent = request.get_json()

        if not updateEvent or eventId:
            return jsonify({"error": "event and eventId required"}), 400
        
        try:
            response = (
                supabase.table("events")
                .update({
                        "title": updateEvent["title"],
                        "start": updateEvent["start"],
                        "end": updateEvent["end"]
                })
                .eq("id", eventId)
                .execute()
            )
        except Exception as error:
            return jsonify({"error:": str(error)}), 500
        return "Successfully updated event"
    
    elif request.method == 'DELETE':
        eventId = request.args.get('eventId')

        if not eventId:
            return jsonify({"error": "eventId is required"}), 400

        try:
            response = (
                supabase.table("events")
                .delete()
                .eq("id", eventId)
                .execute()
            )
        except Exception as error:
            return jsonify({"error": str(error)}), 500
        
        return "Successfully deleted"
    
@app.route('/users/', methods=['GET', 'POST', 'PATCH'])
def users():
    if request.method == 'GET': 

        userId = request.args.get("userId")

        try:
            response = (
                supabase.table("users")
                .select("*")
                .eq("userId", userId)
                .execute()
            )

            user = response.data

            if not user:
                return jsonify({"error": "User not found"}), 404
            return jsonify({"user": user[0]}), 200
            
        except Exception as error:
            return jsonify({"error": str(error)}), 500

    elif request.method == 'POST':
        try:
            user_data = request.get_json()
            
            new_user = {
                "userId": user_data.get("userId"),
                "name": user_data.get("name"),
                "email": user_data.get("email"),
                "profileImage": user_data.get("picture"),
            }

            insert_response = (
                supabase.table("users")
                .insert({
                    "userId": user_data["userId"],
                    "name": user_data["name"],
                    "email": user_data["email"],
                    "profileImage": user_data["picture"],
                })
                .execute()
            )

            return jsonify({"message": "User added", "user": new_user}), 201

        except Exception as error:
            return jsonify({"error": str(error)}), 500
    
    elif request.method == 'PATCH':
        userId = request.args.get('userId')
        userUpdate = request.get_json()

        sendUser = {}

        for key in userUpdate:
            sendUser.push(key = userUpdate[key])

        if not userUpdate or userId:
            return jsonify({"error": "userUpdate and userId required"}), 400
        
        try:
            response = (
                supabase.table("users")
                .update({
                        "name": userUpdate["name"],
                        "eventColor": userUpdate["eventColor"],
                        "profileImage": userUpdate["profileImage"],
                        "linkedUsers": userUpdate["linkedUsers"]
                })
                .eq("id", userId)
                .execute()
            )
        except Exception as error:
            return jsonify({"error:": str(error)}), 500
        return "Successfully updated user"
    
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
        session["picture"] = id_info.get("picture")
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
            "picture": session['picture'],
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
        endDate = "2025-02-28T23:59:59Z"

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