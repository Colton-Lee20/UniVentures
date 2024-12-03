from flask import Flask, jsonify, request, make_response, session, g
from flask_cors import CORS  
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from SchoolDB import get_schools
from mysql.connector import Error
from dotenv import load_dotenv
import requests                        # can remove if no one needs to fill their university database anymore
import os

app = Flask(__name__)

app.secret_key = 'bf2e7a21c3a6e54709d62d885c7cv965f793da2f4f489a23b7b3b94a93f869c4'
app.config['SESSION_COOKIE_SECURE'] = False  # just for local development, ONCE USING HTTPS SHOULD BE True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)  # sets cookie life span
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # just for local development, ONCE USING HTTPS SHOULD BE 'None'

CORS(app, supports_credentials=True)




#
#   THE FOLLOWING CONNECTIONS ARE USED THROUGHOUT THE BACKEND
#   TO CONNECT TO THE DATABASES AND KEEP A PERSISTENT CONNECTION
#   info on flask.g: https://www.geeksforgeeks.org/when-should-flask-g-be-used/
#

#Connection to USERS database
def get_db_connection_users():
    if 'db_connection_users' not in g:
        g.db_connection_users = mysql.connector.connect(
            host="localhost",
            user="root",
            password="CSC450-UniVentures",
            database="users",
        )
    return g.db_connection_users

#Connection to SCHOOLS database
def get_db_connection_schools():
    if 'db_connection_schools' not in g:
        g.db_connection_schools = mysql.connector.connect(
            host="localhost",
            user="root",
            password="CSC450-UniVentures",
            database="schools",
        )
    return g.db_connection_schools

#Close Connection - USERS
@app.teardown_appcontext
def close_db_connection_users(exception=None):
    db_connection_users = g.pop('db_connection_users', None)
    if db_connection_users is not None:
        db_connection_users.close()

#Close Connection - SCHOOLS
@app.teardown_appcontext
def close_db_connection_schools(exception=None):
    db_connection_schools = g.pop('db_connection_schools', None)
    if db_connection_schools is not None:
        db_connection_schools.close()






#
#
#   ACCOUNT ROUTES 
#   INCLUDES login, signup, check if logged in
#            get account data, update account data, 
#            logout
#
#


# LOGIN ROUTE
@app.route('/api/auth/login', methods=['POST'])
def login():
    # USER INPUT
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # GET DATABASE CONNECTION
    db = get_db_connection_users()
    cursor = db.cursor(dictionary=True)                 # Makes the row return as a dictionary!

    #CHECK INPUT WITH DATABASE
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



# SIGNUP ROUTE
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    # USER INPUT
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # CONNECT TO DATABASE
    db = get_db_connection_users()
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
            
            #TRY TO GET UNIVERSITY FOR ACCOUNT
            domain = email.split('@')[1]
            response = get_school_by_domain(domain)
            #school is found
            if response:
                response_json = response.get_json()
                query = "INSERT INTO accounts (email, password, schoolId, schoolName) VALUES (%s, %s, %s, %s)"
                cursor.execute(query, (email, hashed_password, response_json[0], response_json[1]))
            #school is not found
            else:
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
    db = get_db_connection_users()
    cursor = db.cursor(dictionary=True)
    
    try:
        query = "SELECT email, firstName, lastName, schoolName, schoolId FROM accounts WHERE id = %s"
        cursor.execute(query, (user_id,))
        user_info = cursor.fetchone()
        
        if user_info:
            return jsonify(user_info), 200
        else:
            return jsonify({"message": "User not found"}), 404
            
    finally:
        cursor.close()



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
    db = get_db_connection_users()
    cursor = db.cursor()

    try:
        # Update the user's first and last name in the database
        query = "UPDATE accounts SET firstName = %s, lastName = %s WHERE id = %s"
        cursor.execute(query, (first_name, last_name, user_id))
        db.commit()

        return jsonify({"message": "Account updated successfully"}), 200

    finally:
        cursor.close()



#LOGOUT ROUTE
@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    response = make_response(jsonify({'message': 'Logout successful'}))
    response.set_cookie('session', '', expires=0)
    return response, 200





#
#
#   SCHOOL ROUTES
#   Includes search, get details, get specific school, and secretfunction to fill our databases!
#
#



#Search Schools
@app.route('/api/schools', methods=['GET'])
def search_schools():
    query = request.args.get('query')
    schools = get_schools(query)  # Function to query the database
    return jsonify(schools)





# Get school details by ID
@app.route('/api/schools/<int:school_id>', methods=['GET'])
def get_school_by_id(school_id):
    db = get_db_connection_schools()
    cursor = db.cursor(dictionary=True)

    try:
        if db.is_connected():
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
        cursor.close()


#fetch locations from database
@app.route('/api/school/<int:school_id>/locations', methods=['GET'])
def get_school_locations(school_id):
    db = get_db_connection_schools()
    cursor = db.cursor(dictionary=True)

    # Get query parameters (if any)
    type_filter = request.args.get('type', '')
    ratings_filter = request.args.get('ratings', None)

    # Base query with school_id condition
    query = "SELECT * FROM locations WHERE school_id = %s"
    params = [school_id]

    # Add optional filters
    if type_filter:
        query += " AND type LIKE %s"
        params.append(f"%{type_filter}%")
    if ratings_filter is not None:
        query += " AND ratings <= %s"
        params.append(int(ratings_filter))

    cursor.execute(query, params)
    locations = cursor.fetchall()
    cursor.close()
    return jsonify(locations)



#GET SCHOOL BY DOMAIN - for signup route
@app.route('/api/schools/<string:domain>', methods=['GET'])
def get_school_by_domain(domain):
    db = get_db_connection_schools()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT id, school_name FROM names WHERE domain = %s", (domain,))
        school = cursor.fetchone()  # Fetch the school details

        if school:
            return jsonify(school)  # Return the school data in JSON format
        else:
            return jsonify({'error': 'School not found'}), 404  # Return 404 if not found
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500  # Handle errors
    finally:
        cursor.close()




#PURGE AND REFILL your names table!
# This function grabs all universities from
# http://universities.hipolabs.com/ API
# filtered to United States
def insert_school_data(name, domain):
    db = get_db_connection_schools()
    cursor = db.cursor()
    query = "INSERT INTO names (school_name, domain) VALUES (%s, %s)"
    cursor.execute(query, (name, domain))
    db.commit()
    cursor.close()
    
@app.route('/api/supersecretfunction', methods=['GET'])
def purge_and_refill():

    #purge names table
    #-------

    #get api data
    url = "http://universities.hipolabs.com/search?country=united%20states"
    response = requests.get(url)
    data = response.json()

    #iterate data
    for uni in data:
        name = uni["name"]
        domain = uni["domains"][0]
        insert_school_data(name, domain)

    return jsonify({"message": "Data fetched and stored successfully!"})


#Route to add adventures to the database
@app.route('/api/adventure', methods=['POST'])
def add_adventure():
     # Connect to the database
    db = get_db_connection_schools()
    cursor = db.cursor()

    try:
        print("Incoming request data:", request.json)

        # Extract data from request body
        data = request.json
        school_id = data.get('schoolId')
        name = data.get('adventureName')
        type = data.get('type')
        description = data.get('description')
        image_url = data.get('imageUrl')
        address = data.get('address')

        # Validate input
        if not all([school_id, name, description, image_url, address]):
            return jsonify({"error": "All fields are required"}), 400

        # SQL query with placeholders
        query = """
        INSERT INTO locations (school_id, name, type, description, image_url, address)
        VALUES (%s, %s, %s, %s, %s, %s);
        """
        cursor.execute(query, (school_id, name, type, description, image_url, address))
        db.commit()

        return jsonify({"message": "Adventure added successfully"}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()

# API Code
load_dotenv()
GOOGLE_API_KEY = os.getenv("API_KEY")

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="CSC450-UniVentures",
        database="schools"
    )

# Fetch university details
@app.route('/api/university/<int:id>', methods=['GET'])
def get_university(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM names WHERE id = %s", (id))
    university = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(university) if university else ({"error": "University not found"}, 404)

# Fetch nearby places with photos
@app.route('/api/nearby/<int:id>/<string:category>', methods=['GET'])
@app.route('/api/nearby/<int:id>/', methods=['GET'])
def get_nearby_places(id, category=None):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT latitude, longitude FROM names WHERE id = %s"
    cursor.execute(query, (id,))
    location = cursor.fetchone()
    cursor.close()
    conn.close()

    if not location:
        return jsonify({"error": f"Location not found for school: {id}"}), 404


    latitude = location['latitude']
    longitude = location['longitude']
    
    # Define place types for Google Places API
    place_types = {
        "restaurants": "restaurant",
        "restaurant": "restaurant",
        "activities": "tourist_attraction",
        "clubs": "night_club",
        "stores": "store"
    }

    if category:
        place_type = place_types.get(category.lower())
        if not place_type:
            return jsonify({"error": "Invalid category"}), 400
        url = (
            f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
            f"location={latitude},{longitude}&radius=5000&type={place_type}&rankby=prominence&key={GOOGLE_API_KEY}"
        )
    else:
        url = (
            f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
            f"location={latitude},{longitude}&radius=5000&rankby=prominence&key={GOOGLE_API_KEY}"
        )


    # Call Google Places API

    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch nearby places"}), response.status_code

    # Process API response
    places = response.json().get("results", [])
    formatted_places = []

    #sorted_places = sorted(places, key=lambda x: x.get("rating", 0), reverse=True)

    for place in places:
        formatted_place = {
            "name": place.get("name"),
            "vicinity": place.get("vicinity"),
            "rating": place.get("rating"),
            "place_id": place.get("place_id"),
            "photos": []
        }

        # Process photo references if available
        if "photos" in place:
            formatted_place["photos"] = [
                {
                    "photo_reference": photo["photo_reference"],
                    "photo_url": f"https://maps.googleapis.com/maps/api/place/photo"
                                 f"?maxwidth=400&photo_reference={photo['photo_reference']}&key={GOOGLE_API_KEY}"
                }
                for photo in place["photos"]
            ]

        formatted_places.append(formatted_place)

    return jsonify(formatted_places)


    

if __name__ == "__main__":
    app.run(debug=True)



    