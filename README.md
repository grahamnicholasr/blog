# Welcome to blog
Blog is an app you can run locally that allows users to create read edit and delete simple blog posts. Under the hood it utilizes a FastAPI python server, integrating with sqlmodel for a local version of the database, and Angular for the UI client.

# How to run the blog application:
### Running the python FastAPI server with SQLModel:

Built using python 3.14.0, so you will need to install this for best results.
- cd to blog/mini-blog-backend  

- pip install "fastapi[standard]" sqlmodel python-jose "passlib[argon2]"


Run this command to start your server and the good news is that this will also spin up your database if it doesn't exist or connect to your database if it already does exist:  


- uvicorn main:app --reload --host localhost --port 8000

### How to run Angular:
- cd to blog/mini-blog-ui

- npm install  
- npm start  
