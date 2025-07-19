import uuid
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models
from . import schemas

async def get_user(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

async def create_user(db: AsyncSession, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    try:
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except Exception as e:
        await db.rollback()
        if "duplicate key" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or phone number already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user"
        )

async def create_driver(db: AsyncSession, driver: schemas.DriverCreate):
    db_driver = models.Driver(**driver.dict())
    db.add(db_driver)
    await db.commit()
    await db.refresh(db_driver)
    return db_driver

async def create_driver_document(db: AsyncSession, doc: schemas.DriverDocumentCreate):
    db_doc = models.DriverDocument(**doc.dict())
    db.add(db_doc)
    await db.commit()
    await db.refresh(db_doc)
    return db_doc

async def create_ride(db: AsyncSession, ride: schemas.RideCreate):
    db_ride = models.Ride(**ride.dict())
    db.add(db_ride)
    await db.commit()
    await db.refresh(db_ride)
    return db_ride

async def create_ride_status(db: AsyncSession, status: schemas.RideStatusCreate):
    db_status = models.RideStatus(**status.dict())
    db.add(db_status)
    await db.commit()
    await db.refresh(db_status)
    return db_status

async def create_payment(db: AsyncSession, payment: schemas.PaymentCreate):
    db_payment = models.Payment(**payment.dict())
    db.add(db_payment)
    await db.commit()
    await db.refresh(db_payment)
    return db_payment

async def create_vehicle(db: AsyncSession, vehicle: schemas.VehicleCreate):
    db_vehicle = models.Vehicle(**vehicle.dict())
    db.add(db_vehicle)
    await db.commit()
    await db.refresh(db_vehicle)
    return db_vehicle

async def create_feedback(db: AsyncSession, feedback: schemas.FeedbackCreate):
    db_feedback = models.Feedback(**feedback.dict())
    db.add(db_feedback)
    await db.commit()
    await db.refresh(db_feedback)
    return db_feedback

async def create_location(db: AsyncSession, location: schemas.LocationCreate):
    db_location = models.Location(**location.dict())
    db.add(db_location)
    await db.commit()
    await db.refresh(db_location)
    return db_location