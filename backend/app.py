import os
import base64
from urllib import response
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import scraper2
from pymongo import MongoClient
from config import MONGO_URI
from pyngrok import ngrok


app = Flask(__name__)
CORS(app)
IMAGE_FOLDER_TOPS = 'images/tops'
IMAGE_FOLDER_BOTTOMS = 'images/bottoms'

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set!")

client = MongoClient(MONGO_URI)
db = client.get_database('db')
users = db.get_collection('users')

@app.route('/')
def index():
    return "hello world"

@app.route('/scrape_images', methods=['GET'])
def scrape_images():
    print("Scraping images...")
    gender = request.args.get('gender', 'all')
    formality = request.args.get('formality', 'none')
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
        
        return jsonify(response), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to scrape images'}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400
    email = data.get('email')
    password = data.get('password')

    if users.find_one({"username" : email}):
        user = users.find_one({"username" : email})
        if user and user['password'] == password:
            return jsonify({'status': 'success', 'message': 'Login successful'}), 200
        else:
            return jsonify({'status': 'failure', 'message': 'Incorrect username or password'}), 401
    else:
        return jsonify({'status': 'failure', 'message': 'Incorrect username or password'}), 401


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400
    email = data.get('email')
    password = data.get('password')

    if users.find_one({"username" : email}):
        return jsonify({'status': 'failure', 'message': 'Username taken'}), 409
    else:
        users.insert_one({"username" : email, "password" : password})
        return jsonify({'status': 'success', 'message': 'New account created'}), 200

@app.route('/gallery', methods=['GET'])
def gallery():
    email = request.args.get('email')
    # Validate email
    if not email:
        return jsonify({'status': 'error', 'message': 'Email is required'}), 400
    # Fetch images from the database or file system
    images = []
    for user in users.find({"username": email}):
        images.extend(user.get('images', []))
        break
    
    if images == []:
        return jsonify({'status': 'error', 'message': 'No images found'}), 404
    return jsonify({'status': 'success', 'data': images}), 200

@app.route('/save_fit', methods=['POST'])
def save_fit():
    print("Saving fit...")
    data = request.json
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400
    email = data.get('email')
    if not email:
        return jsonify({'status': 'error', 'message': 'Email is required'}), 400
    img_top = data.get('top')
    img_bottom = data.get('bottom')

    if not img_top or not img_bottom:
        return jsonify({'status': 'error', 'message': 'Both top and bottom images are required'}), 400

    users.update_one({"username": email}, {"$addToSet": {"fits": {"top": img_top, "bottom": img_bottom}}})

    return jsonify({'status': 'success', 'message': 'Image uploaded successfully'}), 200

@app.route('/virtual_try_on', methods=['POST']) 
def virtual_try_on():
    data = request.json
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400
    email = data.get('email')
    if not email:
        return jsonify({'status': 'error', 'message': 'Email is required'}), 400
    img_top = data.get('img_top')
    img_bottom = data.get('img_bottom')

    if not img_top or not img_bottom:
        return jsonify({'status': 'error', 'message': 'Both top and bottom images are required'}), 400

    # Here you would implement the logic for virtual try-on
    


    # For now, we will just return the images back
    return jsonify({
        'status': 'success',
        'data': {
            'top': img_top,
            'bottom': img_bottom
        }
    }), 200


if __name__ == '__main__':
    
    app.run(debug=True, port=8000, host='0.0.0.0')