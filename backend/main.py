from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import ads
from routes import courses, trainers, placements, startups, certificates, dashboard_routes, ads
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(courses.router, prefix="/api")
app.include_router(trainers.router, prefix="/api")
app.include_router(placements.router, prefix="/api")
app.include_router(startups.router, prefix="/api")
app.include_router(certificates.router, prefix="/api")
app.include_router(dashboard_routes.router, prefix="/api")


app.include_router(ads.router, prefix="/api")