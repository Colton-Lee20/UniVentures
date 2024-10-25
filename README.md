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

schools
    names
        id            int            pk, nn, uq, ai
        school_name   varchar(255)   nn, uq
        

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

KNOWN ISSUES
Duplicate API requests:
    <React.StrictMode> in index.js causes everything to be rendered twice
    
