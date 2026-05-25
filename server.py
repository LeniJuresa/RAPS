from flask import Flask, jsonify, render_template
import requests

app = Flask(__name__)

ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544'

def get_iss_data():
    data = requests.get(ISS_API).json()
    return {
        'lat': round(data['latitude'], 2),
        'lon': round(data['longitude'], 2),
        'alt': round(data['altitude'], 0),
        'speed': round(data['velocity'])
    }

# i am testing github push pull test

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/iss')
def iss():
    return jsonify(get_iss_data())

if __name__ == '__main__':
    app.run(debug=True)
