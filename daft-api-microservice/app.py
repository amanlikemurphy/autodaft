from fastapi import FastAPI, Query
from daft_service import fetch_listings
import logging

logger = logging.getLogger(__name__)

app = FastAPI()

@app.get("/listings")
async def get_listings(
    location: str = Query(..., description="Location to search for properties"),
    min_price: int = Query(1000),
    max_price: int = Query(2000),
    property_type: str = Query("apartment"),
    bedrooms_min: int = Query(1),
    bedrooms_max: int = Query(3),
    search_type: str = Query("rent")
):
    """
    Fetch listings from Daft.ie based on user preferences.
    """
    logger.debug(f"Received request with params: {locals()}")
    try:
        listings = fetch_listings(
            location=location,
            min_price=min_price,
            max_price=max_price,
            property_type=property_type,
            bedrooms_min=bedrooms_min,
            bedrooms_max=bedrooms_max,
            search_type=search_type
        )
        return {"status": "success", "data": listings}
    except Exception as e:
        logger.error(f"Error in get_listings: {str(e)}")
        return {"status": "error", "message": str(e)}
