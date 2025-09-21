# app/schemas.py
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict

# Auth
class RegisterRequest(BaseModel):
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: EmailStr
    first_name: str
    

# Calories endpoint
class CalorieRequest(BaseModel):
    dish_name: str = Field(..., min_length=1)
    servings: int

    # @validator('dish_name')
    # def validate_dish_name(cls, v):
    #     if not v or len(v.strip()) < 1:
    #         raise ValueError('Dish name cannot be empty')
    #     if len(v) > 100:
    #         raise ValueError('Dish name cannot be longer than 100 characters')
    #     return v.strip()
    
    # @validator("servings")
    # def servings_positive(cls, v):
    #     if v <= 0:
    #         raise ValueError("servings must be a positive integer")
    #     return v

class IngredientBreakdown(BaseModel):
    ingredients: Optional[str] = None

class CalorieResponse(BaseModel):
    dish_name: str
    servings: float
    calories_per_serving: float
    total_calories: float
    source: str = "USDA FoodData Central"
    fdc_id: Optional[int] = None
