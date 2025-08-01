import os
import base64
from urllib import response
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import requests
import scraper2
from pymongo import MongoClient
from config import MONGO_URI
from pyngrok import ngrok
from dotenv import load_dotenv
from img_search import img_search

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)
IMAGE_FOLDER_TOPS = 'images/tops'
IMAGE_FOLDER_BOTTOMS = 'images/bottoms'
IMGBB_KEY = os.getenv('IMGBB_KEY')
SERPAPI_KEY = os.getenv('SERPAPI_KEY')

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
    formality = request.args.get('formality', 'all')
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
    print("Fetching gallery images...")
    email = request.args.get('email')
    print(email)
    # email validation
    if not email:
        return jsonify({'status': 'error', 'message': 'Email is required'}), 400
    # get images
    images = []
    for user in users.find({"username": email}):
        images.extend(user.get('fits', []))
    # print("images", images)
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

    if not img_top.startswith('data:image/') or not img_bottom.startswith('data:image/'):
        return jsonify({'status': 'error', 'message': 'Invalid image format. Expected data:image/jpeg;base64,...'}), 400

    try:
        users.update_one({"username": email}, {"$addToSet": {"fits": {"top": img_top, "bottom": img_bottom}}})
        print(f"Fit saved for user: {email}")
    except Exception as e:
        print(f"Error saving fit: {e}")
        return jsonify({'status': 'error', 'message': 'Error saving fit'}), 500
    return jsonify({'status': 'success', 'message': 'Image uploaded successfully'}), 200

@app.route('/gallery-delete', methods=['DELETE'])
def gallery_delete():
    email = request.args.get('email')
    index = request.args.get('index')
    if not email or not index:
        print("here")
        
        return jsonify({'status': 'error', 'message': 'Email and index are required'}), 400
    user = users.find_one({'username' : email})
    
    index = int(index)
    if user and email and 'fits' in user and 0 <= index < len(user['fits']):
        new_fits = user['fits'][:index] + user['fits'][index + 1:]
        users.update_one({'username': email}, {"$set": {"fits": new_fits}})
        return jsonify({'status': 'success', 'message': 'Fit deleted successfuly'}), 200
    else:
        return jsonify({'status': 'failure', 'message': 'Fit could not be deleted properly'}), 401

@app.route('/upload', methods=['POST'])
def upload():
    print("Uploading image...")
    if not IMGBB_KEY:
        return jsonify({'error': 'IMGBB_KEY environment variable is not set!'}), 500
    if not request.is_json:
        return jsonify({'status': 'error', 'message': 'Request must be JSON'}), 400
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400
    
    base64_image = data.get('image')
    print("got base64 image")

    if not base64_image:
        print("ERROR: No base64 image string provided!")
        return jsonify({'error': 'Missing base64 image string'}), 400

    response = requests.post(
        'https://api.imgbb.com/1/upload',
        data={
            'key': IMGBB_KEY,
            'image': base64_image
        }
    )
    if response.status_code != 200:
        print(f"Failed to upload image: {response.text}")
        return jsonify({'error': 'Failed to upload to ImgBB', 'details': response.text}), 500

    json_data = response.json()
    image_url = json_data['data']['url']
    print(image_url)
    return jsonify({'image_url': image_url})


@app.route("/find-match", methods=["GET"])
def find_match():
    print("Finding match...")
    if not SERPAPI_KEY:
        print("ERROR: SERPAPI_KEY environment variable is not set!")
        return jsonify({"error": "SERPAPI_KEY environment variable is not set!"}), 500
    
    img_url = request.args.get("img_url")
    if not img_url:
        print("ERROR: No img_url parameter provided")
        return jsonify({"error": "img_url parameter is required"}), 400
    
    print(f"Searching for matches for image: {img_url}")
    match_url = img_search(img_url)
    
    if match_url:
        print(f"Found match: {match_url}")
        return jsonify({"match_url": match_url})
    else:
        print("No match found")
        return jsonify({"match_url": None, "message": "No similar images found"})

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


    # return images
    return jsonify({
        'status': 'success',
        'data': {
            'top': img_top,
            'bottom': img_bottom
        }
    }), 200


if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')