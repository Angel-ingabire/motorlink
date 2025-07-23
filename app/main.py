"""
Main FastAPI application for MotorLink ride-sharing service.
Defines API endpoints and routes for all functionality.
"""

import uuid
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from . import crud, models, schemas
from .database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi import Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from jwt import PyJWTError
from .auth import router as auth_router
from .auth import (
    get_current_user,
    get_current_active_user,
    authenticate_user,
    create_access_token,
    oauth2_scheme,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI(
    title="MotorLink API",
    description="Ride-sharing service API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5500",
        "http://localhost:5501",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
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

@app.options("/users/")
async def options_users():
    return {"message": "OK"}

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
import logging

# Set up logging
logger = logging.getLogger(__name__)

@app.post("/users/", response_model=schemas.UserOut)
async def create_user_endpoint(
    user: schemas.UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new user with proper error handling."""
    try:
        logger.info(f"Attempting to create user: {user.email}")
        
        # Log the incoming data
        logger.debug(f"User create data: {user.dict()}")
        
        # Create the user
        db_user = await crud.create_user(db, user)
        
        # Explicitly commit the transaction
        await db.commit()
        await db.refresh(db_user)
        
        logger.info(f"Successfully created user: {db_user.email}")
        logger.debug(f"Created user details: {db_user.__dict__}")
        return db_user
        
    except IntegrityError as e:
        await db.rollback()
        logger.error(f"Integrity error creating user: {str(e)}", exc_info=True)
        if "duplicate key" in str(e).lower():
            if "email" in str(e).lower():
                detail = "Email already exists"
            elif "phone_number" in str(e).lower():
                detail = "Phone number already exists"
            else:
                detail = "Duplicate key violation"
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=detail
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error"
        )
        
    except ValueError as e:
        await db.rollback()
        logger.error(f"Validation error creating user: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Unexpected error creating user: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while creating user"
        )

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

@app.get("/feedback/user/", response_model=List[schemas.FeedbackOut])
async def get_user_feedback(
    current_user: schemas.UserOut = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(models.Review)
        .where(models.Review.reviewer_id == current_user.id)
    )
    return result.scalars().all()

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

@app.get("/users/me/", response_model=schemas.UserOut)
async def read_current_user(
    current_user: schemas.UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user details."""
    return current_user

@app.get("/users/me/profile", response_model=schemas.UserOut)
async def read_user_profile(
    current_user: schemas.UserOut = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's profile details."""
    return current_user

@app.patch("/users/me", response_model=schemas.UserOut)
async def update_user_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile."""
    update_data = user_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user

@app.get("/rides/", response_model=List[schemas.RideOut])
async def read_user_rides(
    passenger_id: uuid.UUID = None,
    status: str = None,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Ride)
    
    if passenger_id:
        query = query.where(models.Ride.passenger_id == passenger_id)
    if status:
        query = query.where(models.Ride.status == status)
    
    result = await db.execute(query.order_by(models.Ride.requested_at.desc()).limit(limit))
    return result.scalars().all()

@app.get("/stats/", response_model=schemas.UserStats)
async def get_user_stats(
    user_id: uuid.UUID = Query(..., description="User ID to get stats for"),
    db: AsyncSession = Depends(get_db)
):
    """Get user statistics."""
    try:
        # Calculate total rides
        rides_count = await db.execute(
            select(func.count(models.Ride.id))
            .where(models.Ride.passenger_id == user_id)
        )
        total_rides = rides_count.scalar() or 0
        
        # Calculate total spent
        payments = await db.execute(
            select(func.sum(models.Payment.amount))
            .join(models.Ride, models.Payment.ride_id == models.Ride.id)
            .where(models.Ride.passenger_id == user_id)
        )
        total_spent = payments.scalar() or 0
        
        # Calculate average rating from reviews
        feedback = await db.execute(
            select(func.avg(models.Review.rating))
            .where(models.Review.reviewed_id == user_id)
        )
        avg_rating = feedback.scalar() or 0
        
        # Calculate favorite route (example implementation)
        favorite_route = await db.execute(
            select(
                models.Ride.pickup_location_name,
                models.Ride.destination_location_name,
                func.count(models.Ride.id).label('count')
            )
            .where(models.Ride.passenger_id == user_id)
            .group_by(models.Ride.pickup_location_name, models.Ride.destination_location_name)
            .order_by(func.count(models.Ride.id).desc())
            .limit(1)
        )
        route = favorite_route.first()
        favorite_route_str = f"{route.pickup_location_name} → {route.destination_location_name}" if route else "N/A"
        
        return {
            "total_rides": total_rides,
            "total_spent": total_spent,
            "avg_rating": round(float(avg_rating), 1) if avg_rating else 0.0,
            "favorite_route": favorite_route_str
        }
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Error calculating statistics")
    
@app.get("/feedback/", response_model=List[schemas.FeedbackOut])
async def read_feedback(
    reviewer_id: uuid.UUID = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Review)
    if reviewer_id:
        query = query.where(models.Review.reviewer_id == reviewer_id)
    result = await db.execute(query)
    return result.scalars().all()

@app.get("/stats/", response_model=schemas.UserStats)
async def get_user_stats(
    user_id: uuid.UUID = Query(..., description="User ID to get stats for"),
    db: AsyncSession = Depends(get_db)
):
    """Get user statistics."""
    try:
        # Calculate total rides
        rides_count = await db.execute(
            select(func.count(models.Ride.id))
            .where(models.Ride.passenger_id == user_id)
        )
        total_rides = rides_count.scalar() or 0
        
        # Calculate total spent
        payments = await db.execute(
            select(func.sum(models.Payment.amount))
            .join(models.Ride, models.Payment.ride_id == models.Ride.id)
            .where(models.Ride.passenger_id == user_id)
        )
        total_spent = payments.scalar() or 0
        
        # Calculate average rating from reviews
        feedback = await db.execute(
            select(func.avg(models.Review.rating))
            .where(models.Review.reviewed_id == user_id)
        )
        avg_rating = feedback.scalar() or 0
        
        return {
            "total_rides": total_rides,
            "total_spent": total_spent,
            "avg_rating": round(float(avg_rating), 1) if avg_rating else 0.0
        }
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Error calculating statistics")
    
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

