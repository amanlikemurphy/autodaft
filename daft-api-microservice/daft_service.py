from daftlistings import Daft, Location, PropertyType, SearchType
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def fetch_listings(
    location, 
    min_price, 
    max_price, 
    property_type, 
    bedrooms_min, 
    bedrooms_max, 
    search_type
):
    daft = Daft()
    logger.debug(f"Initializing search with type: {search_type}")

    # Set search type first
    search_type_map = {
        "rent": SearchType.RESIDENTIAL_RENT,
        "sharing": SearchType.SHARING
    }
    if search_type in search_type_map:
        logger.debug(f"Setting search type to: {search_type_map[search_type]}")
        daft.set_search_type(search_type_map[search_type])
    else:
        raise ValueError(f"Invalid search type: {search_type}")

    try:
        # Set location
        logger.debug(f"Setting location: {location}")
        location_map = {
            "GALWAY": Location.GALWAY,
            "DUBLIN": Location.DUBLIN,
            "CORK": Location.CORK,
            "LIMERICK": Location.LIMERICK,
            "WATERFORD": Location.WATERFORD,
        }
        
        location_upper = location.upper()
        if location_upper in location_map:
            daft.set_location(location_map[location_upper])
        else:
            # For locations not in our map, pass the string directly
            daft.set_location(location)

        # Set price filters
        logger.debug(f"Setting price range: {min_price} - {max_price}")
        daft.set_min_price(min_price)
        daft.set_max_price(max_price)

        # Set property type
        logger.debug(f"Setting property type: {property_type}")
        property_type_map = {
            "apartment": PropertyType.APARTMENT,
            "house": PropertyType.HOUSE,
            "studio": PropertyType.STUDIO_APARTMENT,
        }
        if property_type in property_type_map:
            daft.set_property_type(property_type_map[property_type])
        else:
            raise ValueError(f"Invalid property type: {property_type}")

        # Set bedroom range
        logger.debug(f"Setting bedrooms range: {bedrooms_min} - {bedrooms_max}")
        daft.set_min_beds(bedrooms_min)
        daft.set_max_beds(bedrooms_max)

        # Fetch listings
        logger.debug("Starting search")
        results = []
        for listing in daft.search():
            try:
                results.append({
                    "title": listing.title,
                    "price": listing.price,
                    "url": listing.daft_link,
                    "bedrooms": listing.bedrooms,
                    "propertyType": getattr(listing, 'property_type', None),
                    "address": getattr(listing, 'address', None)
                })
            except AttributeError as e:
                logger.warning(f"Skipping listing due to missing attribute: {e}")
                continue

        logger.debug(f"Found {len(results)} listings")
        return results
    except Exception as e:
        logger.error(f"Error in fetch_listings: {str(e)}")
        raise
