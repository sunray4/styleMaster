from flask import Flask, jsonify, request
from flask_cors import CORS
import scraper2

app = Flask(__name__)
CORS(app)

@app.route('/scrape_images', methods=['POST'])
def scrape_images():
    data = request.json
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400
    gender = data.get('gender')
    formality = data.get('formality')
    success = scraper2.scrape_images(gender, formality)
    if success:
        return jsonify({'status': 'success', 'message': 'Images scraped successfully'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to scrape images'}), 500

@app.route('/echo', methods=['POST'])
def echo():
    data = request.json
    return jsonify({'you_sent': data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)