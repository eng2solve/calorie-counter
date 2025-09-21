import os
from dotenv import load_dotenv

load_dotenv()

#Database configuration
DATABASE_URL = os.environ["DATABASE_URL"]

# USDA API configuration
USDA_API_KEY = os.environ["USDA_API_KEY"]
USDA_SEARCH_URL = os.getenv("USDA_SEARCH_URL")
USDA_FOOD_DETAIL = os.getenv("USDA_FOOD_DETAIL")

# Auth configuration
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# Token expiration time in minutes
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "10"))