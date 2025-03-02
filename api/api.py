from flask import Flask, jsonify, request
import auth

app = Flask(__name__)
authenticator = auth.Auth()

@app.route('/hello', methods=['GET'])
def hello_world():
    return { "hello": "World!" }

@app.route('/login', methods=['GET'])
def login():
    credentials_raw = request.get_json()

    user = auth.User(
        name = credentials_raw["username"],
        password = credentials_raw["password"]
    )

    return authenticator.attempt_login(user)