# UniVenture


Required Installs:
pip install mysql-connector-python
pip install requests (for universities database function)
pip install Flask-Mail
npm install @heroicons/react

-----------------------------------------------------------------

DATABASE

    CREATE TABLE `users`.`accounts` (
      `id` INT NOT NULL AUTO_INCREMENT,
      `email` VARCHAR(255) NOT NULL,
      `password` VARCHAR(255) NOT NULL,
      `firstName` VARCHAR(255) NULL,
      `lastName` VARCHAR(255) NULL,
      `schoolName` VARCHAR(255) NULL,
      `schoolID` INT NULL,
      `verified` TINYINT DEFAULT 0, 
      PRIMARY KEY (`id`),
      UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
      UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
      );
  

    CREATE TABLE `schools`.`names` (
      `id` INT NOT NULL AUTO_INCREMENT,
      `school_name` VARCHAR(255) NOT NULL,
      `domain` VARCHAR(255) NULL,
      PRIMARY KEY (`id`),
      UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE
      );
      
    CREATE TABLE `schools`.`locations` (
      `id` INT NOT NULL AUTO_INCREMENT,
      `school_id` INT,
      `name` VARCHAR(255),
      `description` TEXT,
      `image_url` VARCHAR(255),
      `address` VARCHAR(255),
      `type` VARCHAR(3),
      `ratings` DOUBLE,
      PRIMARY KEY (`id`),
      FOREIGN KEY (`school_id`) REFERENCES `names`(`id`)
    );
    
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
    


TYPES:
A = activitiy
B = bar
Ca = class
Cb = club
E = event
R = restaurant
S = store
O = other






-----------------------------------------------------------------

HOW TO GIT
1. git checkout -b updated-branch
2. git add B:\UniVentures\client\src\Banner.js
2. git add B:\UniVentures\client\src\Contact.js
2. git add B:\other files
2. or git add * or git add -A
3. git commit -m “Updated banner and contact page”
4. git push origin updated-branch
5. PULL REQUEST ON GITHUB
6. MERGE WITH MAIN ON GITHUB
7. git checkout main
8. git pull origin main
9. git checkout -b new-branch


can now start working on new-branch and repeat

------------------------------------------------------------------


What if the activities page went by domain rather than id in database? (.../adventures/missouristate.edu)

KNOWN ISSUES - actually not issue
Duplicate API requests:
    <React.StrictMode> in index.js causes everything to be rendered twice
    Solution: delete that line of code for production; good for testing
