from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/echo', methods=['POST'])
def echo():
    data = request.json
    return jsonify({'you_sent': data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)