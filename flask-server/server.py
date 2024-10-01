from flask import Flask, jsonify, request
from flask_cors import CORS  
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)



# GET USERS ROUTE
@app.route('/users', methods=['GET'])
def get_data():
    # Configure MySQL connection
    db = mysql.connector.connect(
        host="localhost",
        user="root",   
        password="CSC450-UniVentures",
        database="users"
    )
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    result = cursor.fetchall()
    return jsonify(result)








# LOGIN ROUTE
@app.route('/login', methods=['POST'])
def login():
    # USER INPUT
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # CHECK INPUT WITH DATABASE
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="CSC450-UniVentures",
        database="users"
    )
    cursor = db.cursor(dictionary=True)                 # Makes the row return as a dictionary!
    query = "SELECT * FROM accounts WHERE email = %s"   # Parameterized query! (Safe from SQL injection)
    cursor.execute(query, (email,))
    result = cursor.fetchone()
    print("result:", result)
    
    # ACCOUNT EXISTS
    if result:
        stored_password_hash = result['password']   # database password
        
        # PASSWORD CORRECT
        if check_password_hash(stored_password_hash, password): 
            return jsonify({"message": "Login successful", "user": result}), 200
        # PASSWORD INCORRECT
        else:
            return jsonify({"message": "Invalid password"}), 401
        
    # ACCOUNT DOESNT EXIST
    else:
        return jsonify({"message": "Account associated with that email does not exist"}), 404




# SIGNUP ROUTE
@app.route('/signup', methods=['POST'])
def signup():
    # USER INPUT
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # CONNECT TO DATABASE
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="CSC450-UniVentures",
        database="users"
    )
    cursor = db.cursor()
    query = "SELECT * FROM accounts WHERE email = %s"   # Parameterized query! (Safe from SQL injection)
    cursor.execute(query, (email,))
    result = cursor.fetchone()
    
    # EMAIL IS FOUND
    if result:
        return jsonify({"message": "Account with that email already exists"}), 409
    else:
        #HASH INPUT PASSWORD AND INSERT INTO DB
        hashed_password = generate_password_hash(password)
        query = "INSERT INTO accounts (email, password) VALUES (%s, %s)"
        cursor.execute(query, (email, hashed_password))
        db.commit()
        return jsonify({"message": "Account created success!"}), 201

if __name__ == "__main__":
    app.run(debug=True)