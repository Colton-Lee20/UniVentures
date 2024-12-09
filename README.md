# UniVenture

TO DO:
- Finish filters
- Remove change email
- Add account deletion
- Add transition to ActivityModal? (smooth slide up)
- Move logout button to settings button?
- Show reviews on Account page
- Fix stars (only show 1 on preview maybe, show 5 once clicked on)
- Update cookie to keep user signed in for longer
- Add user added custom adventures to their account?
- Let users edit/delete their own adventures they created (could be done on account page)



Required Installs:
pip install mysql-connector-python
pip install requests (for universities database function)
npm install @heroicons/react

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
        verified    TINYINT     defaultValue = FALSE or 0    

schools
    names
        id            int            pk, nn, uq, ai
        school_name   varchar(255)   nn
        domain        varchar(255)   
        latitude double
        longitude double

    locations
        id INT PRIMARY KEY AUTO_INCREMENT,
        school_id INT,  -- Foreign key to link the location to a specific school
        name VARCHAR(255),
        description TEXT,
        image_url VARCHAR(255),
        address VARCHAR(255),
        type VARCHAR(3),
        ratings DOUBLE,
        FOREIGN KEY (school_id) REFERENCES schools(id)
    
    CREATE TABLE `reviews` (
        `review_id` INT NOT NULL AUTO_INCREMENT,
        `school_id` INT NOT NULL,
        `location_id` INT NOT NULL,
        `user_id` INT NOT NULL,
        `review_text` TEXT NOT NULL,
        `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`review_id`),
        KEY `school_id` (`school_id`),
        KEY `location_id` (`location_id`),
        KEY `user_id` (`user_id`),
        CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`school_id`) 
            REFERENCES `names` (`id`) 
            ON DELETE CASCADE,
        CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`location_id`) 
            REFERENCES `locations` (`id`) 
            ON DELETE CASCADE,
        CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`user_id`) 
            REFERENCES `users`.`accounts` (`id`) 
            ON DELETE CASCADE
        ) 
        ENGINE=InnoDB 
        AUTO_INCREMENT=5 
        DEFAULT CHARSET=utf8mb4 
        COLLATE=utf8mb4_0900_ai_ci;


    CREATE TABLE schools.user_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_rating (location_id, user_id),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users.accounts(id) ON DELETE CASCADE
    );
    


TYPES:
A = activitiy
B = bar
Ca = class
Cb = club
E = event
R = restaurant
S = store
O = other


CREATE TABLE `users`.`accounts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `firstName` VARCHAR(255) NULL,
  `lastName` VARCHAR(255) NULL,
  `schoolName` VARCHAR(255) NULL,
  `schoolID` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);

CREATE TABLE `schools`.`names` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `school_name` VARCHAR(255) NOT NULL,
  `domain` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);





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
