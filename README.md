# Welcome to blog
blog is an app you can run locally that allows users to create read edit and delete simple blog posts. Under the hood it utilizes a FastAPI python server, integrating with sqlmodel for a local version of the database, and Angular for the UI client.

# How to run blog:
## Running the server:
- built using python 3.14.0, so you will need to install this for best results.
- cd to blog/mini-blog-backend

pip install sqlmodel
pip install "fastapi[standard]"
uvicorn main:app --reload --host 127.0.0.1 --port 8000

# How to run Angular
TODO: finish this up
- cd to blog/mini-blog-ui
npm install
npm start
