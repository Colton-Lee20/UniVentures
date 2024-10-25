from flask import Flask, jsonify, request, make_response, session
from flask_cors import CORS  
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from SchoolDB import get_schools
from mysql.connector import Error


app = Flask(__name__)

app.secret_key = 'bf2e7a21c3a6e54709d62d885c7cv965f793da2f4f489a23b7b3b94a93f869c4'
app.config['SESSION_COOKIE_SECURE'] = False  # just for local development, ONCE USING HTTPS SHOULD BE True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)  # sets cookie life span
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # just for local development, ONCE USING HTTPS SHOULD BE 'None'

CORS(app, supports_credentials=True)




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
    cursor.execute("SELECT * FROM accounts")
    result = cursor.fetchall()
    return jsonify(result)







# LOGIN ROUTE
@app.route('/api/auth/login', methods=['POST'])
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

    try:
        query = "SELECT * FROM accounts WHERE email = %s"   # Parameterized query! (Safe from SQL injection)
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        
        # ACCOUNT EXISTS
        if result:
            stored_password_hash = result['password']   # database password
            
            # PASSWORD CORRECT
            if check_password_hash(stored_password_hash, password): 
                response = make_response(jsonify({'message': 'Login successful'}))
                session['user_id'] = result['id']
                session.permanent = True
                return response, 200
            # PASSWORD INCORRECT
            else:
                return jsonify({"message": "Invalid password"}), 401
            
        # ACCOUNT DOESNT EXIST
        else:
            return jsonify({"message": "Account associated with that email does not exist"}), 404
    finally:
        cursor.close()
        db.close()







# SIGNUP ROUTE
@app.route('/api/auth/signup', methods=['POST'])
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
    cursor = db.cursor(dictionary=True)

    try:
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

            #GET SESSION ID AND CREATE SESSION
            query = "SELECT * FROM accounts WHERE email = %s"
            cursor.execute(query, (email,))
            new_user = cursor.fetchone()
            if new_user:
                print(new_user)
                session['user_id'] = new_user['id']  # Set the session variable
                session.permanent = True
                return jsonify({"message": "Account created successfully!"}), 201
            else:
                return jsonify({"message": "Failed to retrieve the newly created account."}), 500
    finally:
        cursor.close()
        db.close()






# CHECK SESSION/LOGIN/COOKIE ROUTE
@app.route('/api/auth/check-login', methods=['GET'])
def check_login():
    if 'user_id' in session:
        return jsonify({'isLoggedIn': True})
    else:
        return jsonify({'isLoggedIn': False})



# GET ACCOUNT DATA
@app.route('/api/account', methods=['GET'])
def get_account_info():
    
    # NOT LOGGED IN
    if 'user_id' not in session:
        return jsonify({"message": "User not logged in"}), 401
    
    user_id = session['user_id']
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="CSC450-UniVentures",
        database="users"
    )
    cursor = db.cursor(dictionary=True)
    
    try:
        query = "SELECT email, firstName, lastName FROM accounts WHERE id = %s"
        cursor.execute(query, (user_id,))
        user_info = cursor.fetchone()
        
        if user_info:
            return jsonify(user_info), 200
        else:
            return jsonify({"message": "User not found"}), 404
            
    finally:
        cursor.close()
        db.close()







# UPDATE ACCOUNT DATA
@app.route('/api/account', methods=['POST'])
def update_account_info():
    # NOT LOGGED IN
    if 'user_id' not in session:
        return jsonify({"message": "User not logged in"}), 401

    user_id = session['user_id']
    data = request.get_json()

    # Validate input
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    if not first_name or not last_name:
        return jsonify({"message": "First and last name are required"}), 400

    # Connect to the database
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="CSC450-UniVentures",
        database="users"
    )
    cursor = db.cursor()

    try:
        # Update the user's first and last name in the database
        query = "UPDATE accounts SET firstName = %s, lastName = %s WHERE id = %s"
        cursor.execute(query, (first_name, last_name, user_id))
        db.commit()

        return jsonify({"message": "Account updated successfully"}), 200

    finally:
        cursor.close()
        db.close()









#LOGOUT ROUTE
@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    response = make_response(jsonify({'message': 'Logout successful'}))
    response.set_cookie('session', '', expires=0)
    return response, 200





#Search Schools
@app.route('/api/schools', methods=['GET'])
def search_schools():
    query = request.args.get('query')
    schools = get_schools(query)  # Function to query the database
    return jsonify(schools)





# Get school details by ID
@app.route('/api/schools/<int:school_id>', methods=['GET'])
def get_school_by_id(school_id):
    connection = mysql.connector.connect(
        host='localhost',            
        database='schools',  
        user='root',       
        password='CSC450-UniVentures'     
    )

    try:
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM names WHERE id = %s", (school_id,))
            school = cursor.fetchone()  # Fetch the school details

            if school:
                return jsonify(school)  # Return the school data in JSON format
            else:
                return jsonify({'error': 'School not found'}), 404  # Return 404 if not found
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500  # Handle errors
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


if __name__ == "__main__":
    app.run(debug=True)



    