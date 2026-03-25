from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URL)

db = client["TrainingInstitute"]

certificates_collection = db["certificates"]
profile_collection = db["profile"]
Trainer_collection = db["trainer"]
placement_collection = db["placement"]
courses_collection = db["courses"]
dashboard_collection = db["dashboard_data"]
ads_collection = db["ads"]
ads_controller_collection = db["ads_controller"]


