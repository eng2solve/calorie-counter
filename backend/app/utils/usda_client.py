import requests
from typing import Optional, Dict, Any, List, Tuple
from fuzzywuzzy import fuzz
from ..config import USDA_API_KEY, USDA_FOOD_DETAIL, USDA_SEARCH_URL

# In-memory cache to reduce repeated USDA calls
_USDA_CACHE: Dict[str, Dict] = {}

_DATA_TYPE_PRIORITY = {
    "Foundation": 4,
    "SR Legacy": 3,
    "Survey (FNDDS)": 2,
    "Branded": 1
}

def search_food(query: str, page_size: int = 10) -> Optional[List[Dict[str, Any]]]:
    """Search foods in USDA API"""
    key = f"search::{query.lower()}::{page_size}"
    if key in _USDA_CACHE:
        return _USDA_CACHE[key]

    params = {
        "api_key": USDA_API_KEY,
        "query": query,
        "pageSize": page_size,
        "dataType": ["Foundation", "SR Legacy", "Survey (FNDDS)"],
        "sortBy": "dataType.keyword",
        "sortOrder": "asc"
            }
    try:
        resp = requests.get(USDA_SEARCH_URL, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        foods = data.get("foods") or []
        _USDA_CACHE[key] = foods
        return foods
    except Exception:
        return None


def get_food_detail(fdc_id: int) -> Optional[Dict[str, Any]]:
    """Fetch food details by FDC ID"""
    key = f"food::{fdc_id}"
    if key in _USDA_CACHE:
        return _USDA_CACHE[key]
    url = USDA_FOOD_DETAIL.format(fdc_id)
    params = {"api_key": USDA_API_KEY}
    try:
        resp = requests.get(url, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        _USDA_CACHE[key] = data
        return data
    except Exception:
        return None

def pick_best_food(query: str, foods: List[Dict[str, Any]]) -> Optional[Tuple[Dict[str, Any], float]]:
    """Use fuzzy matching to pick the best matching food"""
    if not foods:
        return None

    best_match = None
    best_score = 0

    for f in foods:
        desc = f.get("description", "").lower()
        query_lower = query.lower()

        ratio = fuzz.ratio(query_lower, desc)
        partial = fuzz.partial_ratio(query_lower, desc)
        token_sort = fuzz.token_sort_ratio(query_lower, desc)
        token_set = fuzz.token_set_ratio(query_lower, desc)

        base_score = (ratio * 0.3 + partial * 0.2 + token_sort * 0.25 + token_set * 0.25)

        # Add dataset priority bonus
        data_type = f.get("dataType", "Branded")
        priority_bonus = _DATA_TYPE_PRIORITY.get(data_type, 1) * 2
        combined_score = base_score + priority_bonus

        if combined_score > best_score:
            best_score = combined_score
            best_match = f

    if not best_match:
        return None

    confidence = (fuzz.ratio(query_lower, best_match.get("description", "").lower()) +
                  fuzz.token_set_ratio(query_lower, best_match.get("description", "").lower())) / 2

    return best_match, confidence


def extract_calories_from_nutrients(food: Dict[str, Any]) -> Dict[str, Any]:
    """Extract calories, serving info, and ingredients"""
    result = {
        "calories_per_serving": None,
        "calories_per_100g": None,
        "serving_size": None,
        "serving_unit": None,
        "ingredients": None,
    }
    # Checking labelNutrients
    label = food.get("labelNutrients") or {}
    if isinstance(label, dict):
        cal = label.get("calories")
        if isinstance(cal, dict):
            val = cal.get("value")
            if val is not None:
                result["calories_per_serving"] = float(val)

    # Checking foodNutrients
    if result["calories_per_serving"] is None:
        nutrients = food.get("foodNutrients") or []
        for n in nutrients:
            name = (n.get("nutrientName") or n.get("name") or "").lower()
            if "energy" in name or "calories" in name:
                amount = n.get("value") or n.get("amount")
                if amount is not None:
                    result["calories_per_100g"] = float(amount)
                    break

    # Serving size
    if food.get("servingSize"):
        result["serving_size"] = float(food["servingSize"])
        result["serving_unit"] = str(food.get("servingSizeUnit") or "")
    elif food.get("serving_size"):
        result["serving_size"] = float(food["serving_size"])
        result["serving_unit"] = str(food.get("serving_size_unit") or "")

    # Ingredients
    if "ingredients" in food:
        result["ingredients"] = food["ingredients"]

    return result


def get_calories_for_dish(query: str, servings: int = 1) -> Optional[Dict[str, Any]]:
    """Main function to compute calories for a query"""
    
    foods = search_food(query, page_size=25)

   
    if not foods:
        return None

    picked = pick_best_food(query, foods)
    if not picked:
        return None

    best, confidence = picked
    data = extract_calories_from_nutrients(best)

    cps = data["calories_per_serving"]
    cpu100 = data["calories_per_100g"]
    serving_size = data["serving_size"]
    serving_unit = (data["serving_unit"] or "").lower()

    final_per_serving = None
    if cps is not None:
        final_per_serving = float(cps)
    elif cpu100 is not None and serving_size and serving_unit in ("g", "gram", "grams"):
        final_per_serving = float(cpu100) * (serving_size / 100.0)
    elif cpu100 is not None:
        final_per_serving = float(cpu100)
    else:
        return None

    total = final_per_serving * servings
    return {
        "fdcId": best.get("fdcId"),
        "description": best.get("description") or query,
        "calories_per_serving": round(final_per_serving, 2),
        "total_calories": round(total, 2),
        "ingredients": data.get("ingredients"),
        "confidence_score": round(confidence, 2),
    }