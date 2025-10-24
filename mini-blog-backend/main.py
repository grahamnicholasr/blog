from typing import Annotated, Union
from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select

class Post(SQLModel, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True, index=True)
    title: str = Field(index=True)
    content: str = Field()

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

@app.post("/createPost")
def create_post(post: Post, session: SessionDep) -> Post:
    session.add(post)
    session.commit()
    session.refresh(post)
    print(post)
    return post

@app.get("/getPosts")
def read_posts(
    *,
    session: SessionDep,
    skip: int = 0,
    limit: int = Query(default=10, lte=100)
) -> list[Post]:
    posts = session.exec(select(Post).offset(skip).limit(limit)).all()
    return posts

@app.get("/getPost/{post_id}")
def read_post(*, session: SessionDep, post_id: int) -> Post:
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.delete("/deletePost/{post_id}")
def delete_post(*, session: SessionDep, post_id: int) -> dict:
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    session.delete(post)
    session.commit()
    return {"ok": True}

@app.get("/searchPosts")
def search_posts(*, session: SessionDep, searchString: str) -> list[Post]:
    posts = session.exec(select(Post).where(Post.title.contains(searchString))).all()
    return posts

@app.put("/updatePost/{post_id}")
def update_post(*, session: SessionDep, updated_post: Post) -> Post:
    post = session.get(Post, updated_post.id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.title = updated_post.title
    post.content = updated_post.content
    session.add(post)
    session.commit()
    session.refresh(post)
    return post