"""
Main FastAPI application for MotorLink ride-sharing service.
Defines API endpoints and routes for all functionality.
"""

import uuid
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from . import crud, models, schemas
from .database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="MotorLink API",
    description="Ride-sharing service API",
    version="1.0.0"
)

@app.on_event("startup")
async def startup():
    """Initialize database tables on startup."""
    async with engine.begin() as conn:
        # For development only - in production use proper migrations
        await conn.run_sync(models.Base.metadata.create_all)

@app.on_event("shutdown")
async def shutdown():
    """Clean up resources on shutdown."""
    await engine.dispose()

@app.post("/users/", response_model=schemas.UserOut)
async def create_user_endpoint(
    user: schemas.UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new user."""
    return await crud.create_user(db, user)

@app.get("/users/{user_id}", response_model=schemas.UserOut)
async def read_user(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a user by ID."""
    try:
        uuid.UUID(user_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID format"
        ) from exc
    return await crud.get_user(db, user_id)

@app.post("/drivers/", response_model=schemas.DriverOut)
async def create_driver_endpoint(
    driver: schemas.DriverCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new driver."""
    return await crud.create_driver(db, driver)

@app.post("/driver_documents/", response_model=schemas.DriverDocumentOut)
async def create_driver_document_endpoint(
    doc: schemas.DriverDocumentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new driver document."""
    return await crud.create_driver_document(db, doc)

@app.post("/rides/", response_model=schemas.RideOut)
async def create_ride_endpoint(
    ride: schemas.RideCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new ride."""
    return await crud.create_ride(db, ride)

@app.post("/ride_status/", response_model=schemas.RideStatusOut)
async def create_ride_status_endpoint(
    status: schemas.RideStatusCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new ride status update."""
    return await crud.create_ride_status(db, status)

@app.post("/payments/", response_model=schemas.PaymentOut)
async def create_payment_endpoint(
    payment: schemas.PaymentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new payment."""
    return await crud.create_payment(db, payment)

@app.post("/vehicles/", response_model=schemas.VehicleOut)
async def create_vehicle_endpoint(
    vehicle: schemas.VehicleCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new vehicle."""
    return await crud.create_vehicle(db, vehicle)

@app.post("/feedback/", response_model=schemas.FeedbackOut)
async def create_feedback_endpoint(
    feedback: schemas.FeedbackCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create new feedback."""
    return await crud.create_feedback(db, feedback)

@app.post("/locations/", response_model=schemas.LocationOut)
async def create_location_endpoint(
    location: schemas.LocationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new location record."""
    return await crud.create_location(db, location)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://your-frontend-domain.com"],  # Or ["*"] for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)