# Calorie Counter Backend

This is the backend service for **Calorie Counter**, which fetches calorie and nutrition information for dishes using the [USDA FoodData Central API](https://api.nal.usda.gov/fdc/v1/foods/search).  
It supports fuzzy matching to improve accuracy when searching for food items.

## Features
- Fetches calories and nutrition info from the USDA Food API.
- Fuzzy matching for food queries
- A in meory caching 
- REST API built with **FastAPI**.


## 📦 Setup Instructions
 
### 2. Create a Virtual Environment
python -m venv venv

### 3 Install Dependencies 
pip install -r requirements.txt

### 4 create `.env` file in the root directory with following varialble

DATABASE_URL=postgresql://username:password@localhost:5432/calorie_count
USDA_API_KEY=`api key`
JWT_SECRET=`your secret key`
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
RATE_LIMIT_PER_MINUTE=10
USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"
USDA_FOOD_DETAIL = "https://api.nal.usda.gov/fdc/v1/food/{}"


### 5 run the server
uvicorn app.main:app --reload

### 6 api testing  go to the link
    http://127.0.0.1:8000/docs



