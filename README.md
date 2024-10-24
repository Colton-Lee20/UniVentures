# UniVenture

Required Installs:
pip install mysql-connector-python

-----------------------------------------------------------------

HOW TO GIT
git checkout -b updated-branch
1. git add B:\UniVentures\client\src\Banner.js
   git add B:\UniVentures\client\src\Contact.js
   git add B:\other files
2. git commit -m “Updated banner and contact page”
3. git push origin updated-branch
|
PULL REQUEST ON GITHUB
|
MERGE WITH MAIN ON GITHUB
|
4. git pull origin main
git checkout -b new-branch
can now start working on new-branch and repeat

------------------------------------------------------------------

KNOWN ISSUES
Duplicate API requests:
    <React.StrictMode> in index.js causes everything to be rendered twice
    
