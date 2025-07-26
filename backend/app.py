import os
import base64
from urllib import response
from flask import Flask, jsonify, request, send_from_directory
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
    print("Scraping images...")
    data = request.json
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400
    gender = data.get('gender')
    formality = data.get('formality')
    success = scraper2.scrape_images(gender, formality)
    if success:
        files = os.listdir(IMAGE_FOLDER_TOPS)
        image_data_tops = []
        for filename in files:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                file_path = os.path.join(IMAGE_FOLDER_TOPS, filename)
                with open(file_path, 'rb') as img_file:
                    img_data = base64.b64encode(img_file.read()).decode('utf-8')
                    image_data_tops.append({
                        'id': filename,
                        'data': f"data:image/jpeg;base64,{img_data}"
                    })
        
        files = os.listdir(IMAGE_FOLDER_BOTTOMS)
        image_data_bottoms = []
        for filename in files:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                file_path = os.path.join(IMAGE_FOLDER_BOTTOMS, filename)
                with open(file_path, 'rb') as img_file:
                    img_data = base64.b64encode(img_file.read()).decode('utf-8')
                    image_data_bottoms.append({
                        'id': filename,
                        'data': f"data:image/jpeg;base64,{img_data}"
                    })
        
        response = {
            'status': 'success',
            'message': f'Images scraped for {gender} - {formality}',
            'data': {
                'tops': image_data_tops,
                'bottoms': image_data_bottoms
            }
        }
        print(response)
        return jsonify(response), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to scrape images'}), 500

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory('images', filename)

@app.route('/echo', methods=['POST'])
def echo():
    data = request.json
    return jsonify({'you_sent': data})

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')