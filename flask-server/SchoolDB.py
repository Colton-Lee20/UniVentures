import mysql.connector
from mysql.connector import Error

def get_schools(query):
    try:
        # Establish a connection to the MySQL database
        connection = mysql.connector.connect(
            host='localhost',            
            database='schools',  
            user='root',       
            password='CSC450-UniVentures'    
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)  # Use dictionary for easier access
            # Use a parameterized query to prevent SQL injection
            cursor.execute("SELECT * FROM names WHERE school_name LIKE %s ORDER BY school_name ASC", ('%' + query + '%',))
            schools = cursor.fetchall()  # Fetch all results

            return schools

    except Error as e:
        print(f"Error: {e}")
        return []

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()