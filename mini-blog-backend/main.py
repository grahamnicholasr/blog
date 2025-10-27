from typing import Annotated, Union, Optional
from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, Query, status
from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import JWTError, jwt

# Security constants
SECRET_KEY = "a_very_secret_key"  # Replace with a real secret key in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Database Models ---

class Post(SQLModel, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True, index=True)
    title: str = Field(index=True)
    content: str = Field()

class User(SQLModel, table=True):
    username: str = Field(primary_key=True, index=True)
    hashed_password: str

class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    username: Union[str, None] = None

# --- Database Setup ---

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

# --- Security Functions ---

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(session: Session, username: str):
    return session.exec(select(User).where(User.username == username)).first()

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(session: SessionDep, token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(session, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

# --- FastAPI App Setup ---

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Your Angular app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication Endpoints ---

@app.post("/token", response_model=Token)
async def login_for_access_token(session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(session, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=User)
def create_user(user: User, session: SessionDep):
    db_user = get_user(session, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.hashed_password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# --- Blog Post Endpoints ---

@app.post("/createPost")
def create_post(post: Post, session: SessionDep, current_user: CurrentUser) -> Post:
    if not current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

@app.get("/getPosts")
def read_posts(*, session: SessionDep) -> list[Post]:
    posts = session.exec(select(Post).order_by(Post.id.desc())).all()
    return posts

@app.get("/getPost/{post_id}")
def read_post(session: SessionDep, post_id: int) -> Post:
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.delete("/deletePost/{post_id}")
def delete_post(session: SessionDep, post_id: int, current_user: CurrentUser) -> dict:
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    session.delete(post)
    session.commit()
    return {"ok": True}

@app.get("/filterByTitle")
def search_by_title(session: SessionDep, searchString: str = "") -> list[Post]:
    if not searchString:
        posts = session.exec(select(Post).order_by(Post.id.desc())).all()
        return posts
    posts = session.exec(select(Post).where(Post.title.contains(searchString)).order_by(Post.id.desc())).all()
    return posts



@app.put("/updatePost")
def update_post(session: SessionDep, updated_post: Post, current_user: CurrentUser) -> Post:
    post = session.get(Post, updated_post.id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to edit this post")
    post.title = updated_post.title
    post.content = updated_post.content
    session.add(post)
    session.commit()
    session.refresh(post)
    return post
