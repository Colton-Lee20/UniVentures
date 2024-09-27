from flask import Flask, jsonify, request
from flask_cors import CORS  
import mysql.connector

app = Flask(__name__)
CORS(app)

# Configure MySQL connection
db = mysql.connector.connect(
    host="localhost",       # or your MySQL server address
    user="root",    # MySQL username
    password="CSC450-UniVentures",# MySQL password
    database="users" # Database name
)

cursor = db.cursor()

@app.route('/get_data', methods=['GET'])
def get_data():
    cursor.execute("SELECT * FROM user")
    result = cursor.fetchall()
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)