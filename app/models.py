"""
SQLAlchemy models for MotorLink database tables.
Defines all database tables as Python classes with proper relationships.
"""

import uuid
from sqlalchemy import Column, String, Date, DateTime, Float, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from .database import Base

class User(Base):
    """Represents a user in the system."""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String)
    phone_number = Column(String, unique=True)
    user_type = Column(String)
    profile_image_url = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String, nullable=True)

class Driver(Base):
    """Represents a driver with vehicle information."""
    __tablename__ = "drivers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    license_number = Column(String, unique=True)
    license_expiry = Column(Date)
    vehicle_type = Column(String)
    vehicle_make = Column(String, nullable=True)
    vehicle_model = Column(String, nullable=True)
    vehicle_year = Column(Integer, nullable=True)
    vehicle_plate = Column(String)

class DriverDocument(Base):
    """Stores documents associated with drivers."""
    __tablename__ = "driver_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    driver_id = Column(UUID(as_uuid=True), ForeignKey('drivers.id'))
    document_type = Column(String)
    document_number = Column(String)
    issue_date = Column(Date)
    expiry_date = Column(Date)
    document_url = Column(String, nullable=True)

class Ride(Base):
    """Represents a ride between passenger and driver."""
    __tablename__ = "rides"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    passenger_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    driver_id = Column(UUID(as_uuid=True), ForeignKey('drivers.id'))
    start_location = Column(String)
    end_location = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime, nullable=True)
    status = Column(String)
    fare = Column(Float)

class RideStatus(Base):
    """Tracks status changes for rides."""
    __tablename__ = "ride_status"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(UUID(as_uuid=True), ForeignKey('rides.id'))
    status = Column(String)
    updated_at = Column(DateTime)

class Payment(Base):
    """Stores payment information for rides."""
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(UUID(as_uuid=True), ForeignKey('rides.id'))
    amount = Column(Float)
    payment_method = Column(String)
    payment_status = Column(String)
    payment_date = Column(DateTime)

class Vehicle(Base):
    """Represents a vehicle owned by a driver."""
    __tablename__ = "vehicles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    driver_id = Column(UUID(as_uuid=True), ForeignKey('drivers.id'))
    vehicle_type = Column(String)
    vehicle_make = Column(String)
    vehicle_model = Column(String)
    vehicle_year = Column(Integer)
    vehicle_plate = Column(String)

class Feedback(Base):
    """Stores feedback from users about rides."""
    __tablename__ = "feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(UUID(as_uuid=True), ForeignKey('rides.id'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    rating = Column(Integer)
    comment = Column(String, nullable=True)

class Location(Base):
    """Tracks user locations for ride matching."""
    __tablename__ = "locations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime)
