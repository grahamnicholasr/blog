from typing import Union
from pydantic import BaseModel
from fastapi import FastAPI


class Post(BaseModel):
    id: int
    title: str
    content: str

class NewPost(BaseModel):
    title: str
    content: str

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/newPost")
def create_post(newPost: NewPost):
    print("Creating post with title: {newPost.title} and content: {newPost.content}")
    return {"id": 12, "title": newPost.title, "content": newPost.content}