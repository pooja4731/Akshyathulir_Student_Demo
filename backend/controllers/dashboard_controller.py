from database import dashboard_collection


# ================= SAVE DASHBOARD =================
def save_dashboard_data_controller(email: str, data: dict):

    data["email"] = email

    dashboard_collection.update_one(
        {"email": email},
        {"$set": data},
        upsert=True
    )

    return {
        "status": "success",
        "message": "Dashboard saved successfully",
        "email": email
    }


# ================= SUMMARY =================
def get_dashboard_kpi_dashboard_controller(email: str):

    data = dashboard_collection.find_one({"email": email})

    if not data:
        return {}

    return data.get("kpi_dashboard", {})


# ================= GROWTH =================
def get_growth_trend_controller(email: str):

    data = dashboard_collection.find_one({"email": email})

    if not data:
        return []

    return data.get("growth", [])


# ================= REVENUE =================
def get_revenue_trend_controller(email: str):

    data = dashboard_collection.find_one({"email": email})

    if not data:
        return []

    return data.get("revenue", [])


# ================= PERFORMANCE TABLE =================
def get_PerformanceSummary_controller(email: str):

    data = dashboard_collection.find_one({"email": email})

    if not data:
        return []

    return data.get("PerformanceSummary", [])


# ================= STAGE DISTRIBUTION =================
def get_StageDistribution_controller(email: str):

    data = dashboard_collection.find_one({"email": email})

    if not data:
        return []

    return data.get("StageDistribution", [])