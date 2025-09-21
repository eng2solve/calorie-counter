from fastapi import APIRouter, Depends, HTTPException, Header
from .. import schemas, auth
from ..utils.usda_client import get_calories_for_dish
from ..schemas import CalorieResponse
from typing import Optional

router = APIRouter(tags=["calories"])

def get_current_user_id(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = parts[1]
    uid = auth.decode_access_token(token)
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return uid

@router.post("/get-calories", response_model=CalorieResponse)
def get_calories(payload: schemas.CalorieRequest, user_id: str = Depends(get_current_user_id)):
    """
    Returns calories for a dish. Requires Authorization Bearer <token>
    """
    res = get_calories_for_dish(payload.dish_name, payload.servings)
    if res is None:
        raise HTTPException(status_code=404, detail="Dish not found or nutrition info unavailable")
    return {
        "dish_name": res.get("description"),
        "servings": payload.servings,
        "calories_per_serving": res.get("calories_per_serving"),
        "total_calories": res.get("total_calories"),
        "source": "USDA FoodData Central",
        "ingredient_breakdown": {"ingredients": res.get("ingredients")} if res.get("ingredients") else None,
        "fdc_id": res.get("fdcId"),
    }