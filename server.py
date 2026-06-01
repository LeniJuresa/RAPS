from flask import Flask, jsonify, render_template
import requests

app = Flask(__name__)

ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544'

def get_iss_data():
    data = requests.get(ISS_API).json()
    return {
        'lat': round(data['latitude'], 4),
        'lon': round(data['longitude'], 4),
        'alt': round(data['altitude'], 0),
        'speed': round(data['velocity'])
    }


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/iss')
def iss():
    return jsonify(get_iss_data())

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)