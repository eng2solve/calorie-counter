from fastapi import FastAPI
from .database import engine, Base
from .routes import auth_routes, calorie_routes
from .utils.rate_limiter import SimpleRateLimiter
from .config import RATE_LIMIT_PER_MINUTE
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Calorie Counter API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB will be created if tables if missing
Base.metadata.create_all(bind=engine)

#rate limiter middleware
app.add_middleware(SimpleRateLimiter)

#routers
app.include_router(auth_routes.router)
app.include_router(calorie_routes.router)

@app.get("/")
def root():
    return {"message": "Calorie Counter API"}
