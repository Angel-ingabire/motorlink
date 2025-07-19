"""
Pydantic schemas for MotorLink API request/response validation.
Defines data models, validation rules, and serialization formats.
"""

from datetime import date, datetime
from enum import Enum
from typing import Optional
import uuid
from pydantic import BaseModel, EmailStr, constr, validator, Field

class UserType(str, Enum):
    """Enum for user types."""
    PASSENGER = "passenger"
    DRIVER = "driver"

class Gender(str, Enum):
    """Enum for gender options."""
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"

class VehicleType(str, Enum):
    """Enum for vehicle types."""
    SEDAN = "sedan"
    SUV = "suv"
    VAN = "van"
    LUXURY = "luxury"
    ELECTRIC = "electric"

class RideStatus(str, Enum):
    """Enum for ride statuses."""
    REQUESTED = "requested"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentMethod(str, Enum):
    """Enum for payment methods."""
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    MOBILE_MONEY = "mobile_money"
    CASH = "cash"

class PaymentStatus(str, Enum):
    """Enum for payment statuses."""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class DocumentType(str, Enum):
    """Enum for document types."""
    LICENSE = "license"
    INSURANCE = "insurance"
    REGISTRATION = "registration"
    ID_CARD = "id_card"

class UserBase(BaseModel):
    """Base schema for user data."""
    email: EmailStr
    password_hash: str = Field(..., min_length=8, description="Hashed password")
    full_name: str = Field(..., min_length=2, max_length=100)
    phone_number: constr(min_length=7, max_length=15)
    user_type: UserType
    profile_image_url: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None

    @validator('phone_number')
    def validate_phone_number(cls, v: str) -> str:
        """Validate phone number contains only digits."""
        if not v.isdigit():
            raise ValueError("Phone number must contain only digits")
        return v

class UserCreate(UserBase):
    """Schema for creating a user."""
    pass

class UserOut(UserBase):
    """Schema for outputting user data."""
    id: uuid.UUID

    class Config:
        orm_mode = True

class DriverBase(BaseModel):
    """Base schema for driver data."""
    user_id: uuid.UUID
    license_number: str = Field(..., min_length=5, max_length=20)
    license_expiry: date
    vehicle_type: VehicleType
    vehicle_make: Optional[str] = Field(None, max_length=50)
    vehicle_model: Optional[str] = Field(None, max_length=50)
    vehicle_year: Optional[int] = Field(None, ge=1900, le=datetime.now().year)
    vehicle_plate: str = Field(..., min_length=4, max_length=15)

    @validator('license_expiry')
    def validate_license_expiry(cls, v: date) -> date:
        """Validate license is not expired."""
        if v < date.today():
            raise ValueError("License must not be expired")
        return v

class DriverCreate(DriverBase):
    """Schema for creating a driver."""
    pass

class DriverOut(DriverBase):
    """Schema for outputting driver data."""
    id: uuid.UUID

    class Config:
        orm_mode = True

class DriverDocumentBase(BaseModel):
    """Base schema for driver documents."""
    driver_id: uuid.UUID
    document_type: DocumentType
    document_number: str = Field(..., min_length=3, max_length=50)
    issue_date: date
    expiry_date: date
    document_url: Optional[str] = None

    @validator('expiry_date')
    def validate_expiry_date(cls, v: date, values: dict) -> date:
        """Validate expiry date is after issue date."""
        if 'issue_date' in values and v < values['issue_date']:
            raise ValueError("Expiry date must be after issue date")
        return v

class DriverDocumentCreate(DriverDocumentBase):
    """Schema for creating a driver document."""
    pass

class DriverDocumentOut(DriverDocumentBase):
    """Schema for outputting driver document data."""
    id: uuid.UUID

    class Config:
        orm_mode = True

class RideBase(BaseModel):
    """Base schema for ride data."""
    passenger_id: uuid.UUID
    driver_id: uuid.UUID
    start_location: str = Field(..., min_length=3, max_length=255)
    end_location: str = Field(..., min_length=3, max_length=255)
    start_time: datetime
    end_time: Optional[datetime] = None
    status: RideStatus
    fare: float = Field(..., gt=0)

    @validator('end_time')
    def validate_end_time(cls, v: Optional[datetime], values: dict) -> Optional[datetime]:
        """Validate end time is after start time."""
        if v and 'start_time' in values and v < values['start_time']:
            raise ValueError("End time must be after start time")
        return v

class RideCreate(RideBase):
    """Schema for creating a ride."""
    pass

class RideOut(RideBase):
    """Schema for outputting ride data."""
    id: uuid.UUID

    class Config:
        orm_mode = True

class RideStatusBase(BaseModel):
    """Base schema for ride status updates."""
    ride_id: uuid.UUID
    status: RideStatus
    updated_at: datetime = Field(default_factory=datetime.now)

class RideStatusCreate(RideStatusBase):
    """Schema for creating a ride status update."""
    pass

class RideStatusOut(RideStatusBase):
    """Schema for outputting ride status data."""
    id: uuid.UUID

    class Config:
        orm_mode = True

class PaymentBase(BaseModel):
    """Base schema for payment data."""
    ride_id: uuid.UUID
    amount: float = Field(..., gt=0)
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    payment_date: datetime = Field(default_factory=datetime.now)

class PaymentCreate(PaymentBase):
    """Schema for creating a payment."""
    pass

class PaymentOut(PaymentBase):
    """Schema for outputting payment data."""
    id: uuid.UUID

    class Config:
        orm_mode = True

class VehicleBase(BaseModel):
    """Base schema for vehicle data."""
    driver_id: uuid.UUID
    vehicle_type: VehicleType
    vehicle_make: str = Field(..., min_length=2, max_length=50)
    vehicle_model: str = Field(..., min_length=2, max_length=50)
    vehicle_year: int = Field(..., ge=1900, le=datetime.now().year)
    vehicle_plate: str = Field(..., min_length=4, max_length=15)

class VehicleCreate(VehicleBase):
    """Schema for creating a vehicle."""
    pass

class VehicleOut(VehicleBase):
    """Schema for outputting vehicle data."""
    id: uuid.UUID

    class Config:
        orm_mode = True

class FeedbackBase(BaseModel):
    """Base schema for feedback data."""
    ride_id: uuid.UUID
    user_id: uuid.UUID
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = Field(None, max_length=500)

class FeedbackCreate(FeedbackBase):
    """Schema for creating feedback."""
    pass

class FeedbackOut(FeedbackBase):
    """Schema for outputting feedback data."""
    id: uuid.UUID

    class Config:
        orm_mode = True

class LocationBase(BaseModel):
    """Base schema for location data."""
    user_id: uuid.UUID
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    timestamp: datetime = Field(default_factory=datetime.now)

class LocationCreate(LocationBase):
    """Schema for creating a location."""
    pass

class LocationOut(LocationBase):
    """Schema for outputting location data."""
    id: uuid.UUID

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    """Schema for updating user data."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone_number: Optional[constr(min_length=7, max_length=15)] = None
    profile_image_url: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None

class RideUpdate(BaseModel):
    """Schema for updating ride data."""
    end_location: Optional[str] = Field(None, min_length=3, max_length=255)
    end_time: Optional[datetime] = None
    status: Optional[RideStatus] = None
    fare: Optional[float] = Field(None, gt=0)

class Token(BaseModel):
    """Schema for authentication tokens."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Schema for token payload data."""
    email: Optional[str] = None
