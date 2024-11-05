# UniVenture

Required Installs:
pip install mysql-connector-python

-----------------------------------------------------------------

DATABASE
users
    accounts
        id        int            pk,nn,uq,ai
        email     varchar(255)   nn, uq
        password  varchar(255)   nn
        firstName varchar(255)
        lastName  varchar(255)
        schoolName varchar(255)
        schoolId  int

schools
    names
        id            int            pk, nn, uq, ai
        school_name   varchar(255)   nn
        domain        varchar(255)   

    locations
        id INT PRIMARY KEY AUTO_INCREMENT,
        school_id INT,  -- Foreign key to link the location to a specific school
        name VARCHAR(255),
        description TEXT,
        image_url VARCHAR(255),
        address VARCHAR(255),
        FOREIGN KEY (school_id) REFERENCES schools(id) 

        

-----------------------------------------------------------------

HOW TO GIT
1. git checkout -b updated-branch
2. git add B:\UniVentures\client\src\Banner.js
2. git add B:\UniVentures\client\src\Contact.js
2. git add B:\other files
3. git commit -m “Updated banner and contact page”
4. git push origin updated-branch
5. PULL REQUEST ON GITHUB
6. MERGE WITH MAIN ON GITHUB
7. git checkout main
8. git pull origin main
9. git checkout -b new-branch


can now start working on new-branch and repeat

------------------------------------------------------------------

Linking school won't work unless register new account. or manually add school in database

What if the activities page went by domain rather than id in database? (.../adventures/missouristate.edu)

KNOWN ISSUES - actually not issue
Duplicate API requests:
    <React.StrictMode> in index.js causes everything to be rendered twice
    Solution: delete that line of code for production; good for testing
