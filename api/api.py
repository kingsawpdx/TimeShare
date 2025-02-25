from flask import Flask, request, jsonify
import os
from supabase import create_client, Client
from flask_cors import CORS

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url,key)

app = Flask(__name__)
CORS(app)

@app.route('/hello', methods=['GET'])
def hello_world():
    return { "hello": "World!" }

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
        event = request.get_json()

        if not event:
            return jsonify({"error": "event is required"}), 400
        
        try:
            response = (
                supabase.table("events")
                .insert({
                        "title": event["title"],
                        "userId": event["userId"],
                        "start": event["start"],
                        "end": event["end"]
                })
                .execute()
            )
        except Exception as error:
            return jsonify({"error:": str(error)}), 500
        return 'Successfully added event'

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
    
# Until auth is finished, the first user in the database is considered logged in
@app.route('/users/', methods=['GET'])
def users():
    if request.method == 'GET': 
        
        try:
            response = (
                supabase.table("users")
                .select("*")
                .eq("id", 1)
                .execute()
            )

            user = response.data
            
        except Exception as error:
            return jsonify({"error": str(error)}), 500

        return user
    
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