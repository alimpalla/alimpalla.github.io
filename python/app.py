# generic Flask initialization
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

import update_prayer_times
import update_prayer_times_eic

# generic Flask return
@app.route('/')
@cross_origin(["https://alimpalla.github.io/"])
def hello_world():
    return 'This is my first API call!'

@app.route('/return_times', methods=["GET"])
@cross_origin(["https://alimpalla.github.io/"])
def return_times():
    return update_prayer_times.send_api_dict()

'''
@app.route('/return_times_eic', methods=["GET"])
@cross_origin()
def return_times_eic():
    return update_prayer_times_eic.send_api_dict()
'''

@app.route('/return_times_eic', methods=["POST"])
@cross_origin(["https://www.eicsanjose.org"])
def return_times_eic_post():
    times_dict = request.get_json()
    return update_prayer_times_eic.send_api_dict_post(times_dict)