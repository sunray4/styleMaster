import os
from urllib import response
from flask import Flask, jsonify, request
from flask_cors import CORS
import scraper2


app = Flask(__name__)
CORS(app)
IMAGE_FOLDER_TOPS = 'images/tops'
IMAGE_FOLDER_BOTTOMS = 'images/bottoms'


@app.route('/')
def index():
    return "hello world"

@app.route('/scrape_images', methods=['POST'])
def scrape_images():
    data = request.json
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400
    gender = data.get('gender')
    formality = data.get('formality')
    success = scraper2.scrape_images(gender, formality)
    if success:
        files = os.listdir(IMAGE_FOLDER_TOPS)
        base_url = request.host_url
        image_urls_tops = [
            f"{base_url}images/tops/{filename}"
            for filename in files if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
        ]
        files = os.listdir(IMAGE_FOLDER_BOTTOMS)
        image_urls_bottoms = [
            f"{base_url}images/bottoms/{filename}"
            for filename in files if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
        ]
        response = {
            'status': 'success',
            'message': f'Images scraped for {gender} - {formality}',
            'data': {
                'tops': image_urls_tops,
                'bottoms': image_urls_bottoms
            }
        }
        return jsonify(response), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to scrape images'}), 500

@app.route('/echo', methods=['POST'])
def echo():
    data = request.json
    return jsonify({'you_sent': data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)