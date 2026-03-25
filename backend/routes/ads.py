# from fastapi import APIRouter
# from database import db

# router = APIRouter()

# @router.get("/ads/{email}/{page}")
# async def get_ads(email: str, page: str):
#     ads = list(db.ads.find({
#         "adminEmail": email,
#         "page": page
#     }, {"_id": 0}))
#     return ads

from fastapi import APIRouter
from database import ads_collection

router = APIRouter()

@router.get("/ads/{email}/{page}")
async def get_ads(email: str, page: str):

    ads = list(
        ads_collection.find(
            {
                "adminEmail": email,
                "page": page
            },
            {"_id": 0}
        )
    )

    return ads