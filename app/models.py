"""
SQLAlchemy models for MotorLink database tables.
Defines all database tables as Python classes with proper relationships.
"""

<<<<<<< HEAD
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, 
    Enum as SQLAlchemyEnum, CheckConstraint, Numeric, Text, JSON,
    Date
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY, INET
from sqlalchemy.sql import func, text
from sqlalchemy.orm import relationship
from enum import Enum
import uuid
from datetime import datetime
from .database import Base

# =============================================
# ENUM Definitions (Matching PostgreSQL enums)
# =============================================

class ApprovalStatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    suspended = "suspended"

class AuditActionEnum(str, Enum):
    create = "create"
    update = "update"
    delete = "delete"
    view = "view"

class BackgroundCheckStatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class CancellationSourceEnum(str, Enum):
    passenger = "passenger"
    driver = "driver"
    system = "system"

class CommunicationStatusEnum(str, Enum):
    pending = "pending"
    sent = "sent"
    delivered = "delivered"
    failed = "failed"
    bounced = "bounced"

class CommunicationTypeEnum(str, Enum):
    sms = "sms"
    email = "email"
    push_notification = "push_notification"
    phone_call = "phone_call"

class DataTypeEnum(str, Enum):
    string = "string"
    integer = "integer"
    decimal = "decimal"
    boolean = "boolean"
    json = "json"

class DeliveryMethodEnum(str, Enum):
    push = "push"
    sms = "sms"
    email = "email"
    in_app = "in_app"

class DeliveryStatusEnum(str, Enum):
    pending = "pending"
    sent = "sent"
    delivered = "delivered"
    failed = "failed"

class DocumentTypeEnum(str, Enum):
    license = "license"
    insurance = "insurance"
    vehicle_registration = "vehicle_registration"
    background_check = "background_check"

class DriverStatusEnum(str, Enum):
    offline = "offline"
    online = "online"
    busy = "busy"

class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"

class LocationTypeEnum(str, Enum):
    district = "district"
    sector = "sector"
    landmark = "landmark"
    business = "business"
    transport_hub = "transport_hub"

class MethodTypeEnum(str, Enum):
    mobile_money = "mobile_money"
    bank_card = "bank_card"
    cash = "cash"

class NotificationTypeEnum(str, Enum):
    ride_request = "ride_request"
    driver_assigned = "driver_assigned"
    driver_arrived = "driver_arrived"
    ride_started = "ride_started"
    ride_completed = "ride_completed"
    payment_completed = "payment_completed"
    system_announcement = "system_announcement"

class PaymentMethodEnum(str, Enum):
    cash = "cash"
    mobile_money = "mobile_money"
    card = "card"

class PaymentStatusEnum(str, Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"

class PaymentTypeEnum(str, Enum):
    ride_fare = "ride_fare"
    tip = "tip"
    cancellation_fee = "cancellation_fee"
    refund = "refund"

class PayoutStatusEnum(str, Enum):
    pending = "pending"
    paid = "paid"
    hold = "hold"

class ProviderEnum(str, Enum):
    mtn = "mtn"
    airtel = "airtel"
    tigo = "tigo"
    visa = "visa"
    mastercard = "mastercard"

class ProviderServiceEnum(str, Enum):
    twilio = "twilio"
    sendgrid = "sendgrid"
    firebase = "firebase"
    local = "local"

class ReviewTypeEnum(str, Enum):
    passenger_to_driver = "passenger_to_driver"
    driver_to_passenger = "driver_to_passenger"

class RideStatusEnum(str, Enum):
    requested = "requested"
    driver_assigned = "driver_assigned"
    driver_arrived = "driver_arrived"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

class StatusEnum(str, Enum):
    active = "active"
    suspended = "suspended"
    deleted = "deleted"

class UserTypeEnum(str, Enum):
    passenger = "passenger"
    driver = "driver"

class VehicleTypeEnum(str, Enum):
    motorcycle = "motorcycle"
    car = "car"
    van = "van"

class VerificationStatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class VoteTypeEnum(str, Enum):
    helpful = "helpful"
    not_helpful = "not_helpful"
    inappropriate = "inappropriate"

# =============================================
# Model Definitions
# =============================================

=======
import uuid
from sqlalchemy import Column, String, Date, DateTime, Float, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from .database import Base

>>>>>>> 2f868d27baf68fa9ba71d12ce7ba2fa2b095c3b8
class User(Base):
    """Represents a user in the system."""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
<<<<<<< HEAD
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), unique=True, nullable=False)
    user_type = Column(SQLAlchemyEnum(UserTypeEnum), nullable=False)
    profile_image_url = Column(String(500))
    date_of_birth = Column(Date)
    gender = Column(SQLAlchemyEnum(GenderEnum))
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    status = Column(SQLAlchemyEnum(StatusEnum), default=StatusEnum.active)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime)

    # Relationships
    driver = relationship("Driver", back_populates="user", uselist=False)
    payments = relationship("Payment", back_populates="user")
    reviews_given = relationship("Review", foreign_keys="[Review.reviewer_id]", back_populates="reviewer")
    reviews_received = relationship("Review", foreign_keys="[Review.reviewed_id]", back_populates="reviewed")
    user_profile = relationship("UserProfile", back_populates="user", uselist=False)
    payment_methods = relationship("PaymentMethod", back_populates="user")
    sessions = relationship("UserSession", back_populates="user")
    documents = relationship("DriverDocument", back_populates="verifier", foreign_keys="[DriverDocument.verified_by]")
    rides_as_passenger = relationship("Ride", foreign_keys="[Ride.passenger_id]", back_populates="passenger")
    notifications = relationship("Notification", back_populates="user")
    communications = relationship("CommunicationLog", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
=======
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String)
    phone_number = Column(String, unique=True)
    user_type = Column(String)
    profile_image_url = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
>>>>>>> 2f868d27baf68fa9ba71d12ce7ba2fa2b095c3b8

class Driver(Base):
    """Represents a driver with vehicle information."""
    __tablename__ = "drivers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
<<<<<<< HEAD
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), unique=True)
    license_number = Column(String(50), unique=True, nullable=False)
    license_expiry = Column(Date, nullable=False)
    license_image_url = Column(String(500))
    vehicle_type = Column(SQLAlchemyEnum(VehicleTypeEnum), nullable=False)
    vehicle_make = Column(String(100))
    vehicle_model = Column(String(100))
    vehicle_year = Column(Integer)
    vehicle_plate = Column(String(20), unique=True, nullable=False)
    vehicle_color = Column(String(50))
    vehicle_image_url = Column(String(500))
    insurance_number = Column(String(100))
    insurance_expiry = Column(Date)
    insurance_image_url = Column(String(500))
    background_check_status = Column(SQLAlchemyEnum(BackgroundCheckStatusEnum), default=BackgroundCheckStatusEnum.pending)
    approval_status = Column(SQLAlchemyEnum(ApprovalStatusEnum), default=ApprovalStatusEnum.pending)
    rating = Column(Numeric(3, 2), default=0.00)
    total_rides = Column(Integer, default=0)
    total_earnings = Column(Numeric(12, 2), default=0.00)
    current_status = Column(SQLAlchemyEnum(DriverStatusEnum), default=DriverStatusEnum.offline)
    current_latitude = Column(Numeric(10, 8))
    current_longitude = Column(Numeric(11, 8))
    last_location_update = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="driver")
    documents = relationship("DriverDocument", back_populates="driver")
    rides = relationship("Ride", back_populates="driver")
    earnings = relationship("DriverEarnings", back_populates="driver")
    tracking = relationship("RideTracking", back_populates="driver")
    ride_requests = relationship("RideRequest", back_populates="driver")

    @property
    def ride_requests(self):
        # Manual query to get ride requests
        from .database import SessionLocal
        db = SessionLocal()
        try:
            return db.query(RideRequest).filter(
                RideRequest.available_driver_ids.contains([self.id])
            ).all()
        finally:
            db.close()
=======
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    license_number = Column(String, unique=True)
    license_expiry = Column(Date)
    vehicle_type = Column(String)
    vehicle_make = Column(String, nullable=True)
    vehicle_model = Column(String, nullable=True)
    vehicle_year = Column(Integer, nullable=True)
    vehicle_plate = Column(String)
>>>>>>> 2f868d27baf68fa9ba71d12ce7ba2fa2b095c3b8

class DriverDocument(Base):
    """Stores documents associated with drivers."""
    __tablename__ = "driver_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    driver_id = Column(UUID(as_uuid=True), ForeignKey('drivers.id'))
<<<<<<< HEAD
    document_type = Column(SQLAlchemyEnum(DocumentTypeEnum))
    document_url = Column(String(500), nullable=False)
    verification_status = Column(SQLAlchemyEnum(VerificationStatusEnum), default=VerificationStatusEnum.pending)
    verified_by = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    verified_at = Column(DateTime)
    rejection_reason = Column(Text)
    expiry_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    driver = relationship("Driver", back_populates="documents")
    verifier = relationship("User", back_populates="documents")

class DriverEarnings(Base):
    """Tracks driver earnings and payouts."""
    __tablename__ = "driver_earnings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    driver_id = Column(UUID(as_uuid=True), ForeignKey('drivers.id'), nullable=False)
    ride_id = Column(UUID(as_uuid=True), ForeignKey('rides.id'))
    gross_amount = Column(Numeric(10, 2), nullable=False)
    commission_rate = Column(Numeric(5, 4), default=0.20)
    commission_amount = Column(Numeric(10, 2), nullable=False)
    net_amount = Column(Numeric(10, 2), nullable=False)
    bonus_amount = Column(Numeric(8, 2), default=0.00)
    earnings_date = Column(Date, nullable=False)
    payout_status = Column(SQLAlchemyEnum(PayoutStatusEnum), default=PayoutStatusEnum.pending)
    payout_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    driver = relationship("Driver", back_populates="earnings")
    ride = relationship("Ride", back_populates="earnings")
=======
    document_type = Column(String)
    document_number = Column(String)
    issue_date = Column(Date)
    expiry_date = Column(Date)
    document_url = Column(String, nullable=True)
>>>>>>> 2f868d27baf68fa9ba71d12ce7ba2fa2b095c3b8

class Ride(Base):
    """Represents a ride between passenger and driver."""
    __tablename__ = "rides"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
<<<<<<< HEAD
    passenger_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    driver_id = Column(UUID(as_uuid=True), ForeignKey('drivers.id'))
    ride_type = Column(SQLAlchemyEnum(VehicleTypeEnum), nullable=False)
    pickup_location_name = Column(String(255), nullable=False)
    pickup_address = Column(Text)
    pickup_latitude = Column(Numeric(10, 8), nullable=False)
    pickup_longitude = Column(Numeric(11, 8), nullable=False)
    destination_location_name = Column(String(255), nullable=False)
    destination_address = Column(Text)
    destination_latitude = Column(Numeric(10, 8), nullable=False)
    destination_longitude = Column(Numeric(11, 8), nullable=False)
    estimated_distance_km = Column(Numeric(8, 2))
    actual_distance_km = Column(Numeric(8, 2))
    estimated_duration_minutes = Column(Integer)
    actual_duration_minutes = Column(Integer)
    estimated_fare = Column(Numeric(8, 2))
    final_fare = Column(Numeric(8, 2))
    surge_multiplier = Column(Numeric(3, 2), default=1.00)
    status = Column(SQLAlchemyEnum(RideStatusEnum), default=RideStatusEnum.requested)
    scheduled_time = Column(DateTime)
    requested_at = Column(DateTime, server_default=func.now())
    driver_assigned_at = Column(DateTime)
    driver_arrived_at = Column(DateTime)
    ride_started_at = Column(DateTime)
    ride_completed_at = Column(DateTime)
    cancelled_at = Column(DateTime)
    cancellation_reason = Column(Text)
    cancelled_by = Column(SQLAlchemyEnum(CancellationSourceEnum))
    passenger_notes = Column(Text)
    driver_notes = Column(Text)
    payment_method = Column(SQLAlchemyEnum(PaymentMethodEnum), default=PaymentMethodEnum.cash)
    payment_status = Column(SQLAlchemyEnum(PaymentStatusEnum), default=PaymentStatusEnum.pending)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    passenger = relationship("User", foreign_keys=[passenger_id], back_populates="rides_as_passenger")
    driver = relationship("Driver", back_populates="rides")
    payments = relationship("Payment", back_populates="ride")
    reviews = relationship("Review", back_populates="ride")
    tracking = relationship("RideTracking", back_populates="ride")
    ride_request = relationship("RideRequest", back_populates="ride", uselist=False)
    earnings = relationship("DriverEarnings", back_populates="ride")
    notifications = relationship("Notification", back_populates="ride")
    communications = relationship("CommunicationLog", back_populates="ride")

class RideRequest(Base):
    """Tracks ride requests and driver assignment."""
    __tablename__ = "ride_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(UUID(as_uuid=True), ForeignKey('rides.id'))
    available_driver_ids = Column(ARRAY(UUID(as_uuid=True)), server_default=text("'{}'::uuid[]"))
    request_radius_km = Column(Numeric(4, 2), default=5.0)
    max_wait_time_minutes = Column(Integer, default=10)
    priority_score = Column(Integer, default=100)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    ride = relationship("Ride", back_populates="ride_request")

class RideTracking(Base):
    """Tracks real-time location data during rides."""
    __tablename__ = "ride_tracking"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(UUID(as_uuid=True), ForeignKey('rides.id'))
    driver_id = Column(UUID(as_uuid=True), ForeignKey('drivers.id'))
    driver_latitude = Column(Numeric(10, 8), nullable=False)
    driver_longitude = Column(Numeric(11, 8), nullable=False)
    passenger_latitude = Column(Numeric(10, 8))
    passenger_longitude = Column(Numeric(11, 8))
    speed_kmh = Column(Numeric(5, 2))
    heading_degrees = Column(Integer)
    accuracy_meters = Column(Numeric(6, 2))
    timestamp = Column(DateTime, server_default=func.now())

    # Relationships
    ride = relationship("Ride", back_populates="tracking")
    driver = relationship("Driver", back_populates="tracking")  

    # Relationships
    ride = relationship("Ride", back_populates="tracking")

class PaymentMethod(Base):
    """Stores user payment methods."""
    __tablename__ = "payment_methods"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    method_type = Column(SQLAlchemyEnum(MethodTypeEnum), nullable=False)
    provider = Column(SQLAlchemyEnum(ProviderEnum), nullable=False)
    account_number = Column(String(255), nullable=False)
    account_name = Column(String(255))
    is_default = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="payment_methods")
    payments = relationship("Payment", back_populates="payment_method")
=======
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
>>>>>>> 2f868d27baf68fa9ba71d12ce7ba2fa2b095c3b8

class Payment(Base):
    """Stores payment information for rides."""
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(UUID(as_uuid=True), ForeignKey('rides.id'))
<<<<<<< HEAD
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    payment_method_id = Column(UUID(as_uuid=True), ForeignKey('payment_methods.id'))
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="RWF")
    payment_type = Column(SQLAlchemyEnum(PaymentTypeEnum), default=PaymentTypeEnum.ride_fare)
    status = Column(SQLAlchemyEnum(PaymentStatusEnum), default=PaymentStatusEnum.pending)
    external_transaction_id = Column(String(255))
    external_reference = Column(String(255))
    provider_response = Column(JSON)
    failure_reason = Column(Text)
    processed_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    ride = relationship("Ride", back_populates="payments")
    user = relationship("User", back_populates="payments")
    payment_method = relationship("PaymentMethod", back_populates="payments")

class Review(Base):
    """Stores feedback from users about rides."""
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(UUID(as_uuid=True), ForeignKey('rides.id'), nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    reviewed_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    rating = Column(Integer, nullable=False)
    review_text = Column(Text)
    review_type = Column(SQLAlchemyEnum(ReviewTypeEnum), nullable=False)
    is_anonymous = Column(Boolean, default=False)
    helpful_count = Column(Integer, default=0)
    inappropriate_reports = Column(Integer, default=0)
    is_hidden = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Constraints
    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='reviews_rating_check'),
    )

    # Relationships
    ride = relationship("Ride", back_populates="reviews")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_given")
    reviewed = relationship("User", foreign_keys=[reviewed_id], back_populates="reviews_received")
    votes = relationship("ReviewVote", back_populates="review")

class ReviewVote(Base):
    """Tracks user votes on reviews."""
    __tablename__ = "review_votes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    review_id = Column(UUID(as_uuid=True), ForeignKey('reviews.id'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    vote_type = Column(SQLAlchemyEnum(VoteTypeEnum), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    review = relationship("Review", back_populates="votes")
    user = relationship("User")

class Location(Base):
    """Stores location data for ride matching."""
    __tablename__ = "locations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=False)
    address = Column(Text)
    latitude = Column(Numeric(10, 8), nullable=False)
    longitude = Column(Numeric(11, 8), nullable=False)
    location_type = Column(SQLAlchemyEnum(LocationTypeEnum), nullable=False)
    parent_location_id = Column(UUID(as_uuid=True), ForeignKey('locations.id'))
    is_active = Column(Boolean, default=True)
    popularity_score = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    parent_location = relationship("Location", remote_side=[id])

class Notification(Base):
    """Stores user notifications."""
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    ride_id = Column(UUID(as_uuid=True), ForeignKey('rides.id'))
    type = Column(SQLAlchemyEnum(NotificationTypeEnum), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    delivery_method = Column(SQLAlchemyEnum(DeliveryMethodEnum), nullable=False)
    delivery_status = Column(SQLAlchemyEnum(DeliveryStatusEnum), default=DeliveryStatusEnum.pending)
    external_message_id = Column(String(255))
    scheduled_at = Column(DateTime)
    sent_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="notifications")
    ride = relationship("Ride", back_populates="notifications")

class CommunicationLog(Base):
    """Logs all communications with users."""
    __tablename__ = "communication_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    ride_id = Column(UUID(as_uuid=True), ForeignKey('rides.id'))
    communication_type = Column(SQLAlchemyEnum(CommunicationTypeEnum), nullable=False)
    recipient = Column(String(255), nullable=False)
    content = Column(Text)
    provider = Column(SQLAlchemyEnum(ProviderServiceEnum), nullable=False)
    external_id = Column(String(255))
    status = Column(SQLAlchemyEnum(CommunicationStatusEnum), default=CommunicationStatusEnum.pending)
    cost_amount = Column(Numeric(8, 4))
    sent_at = Column(DateTime)
    delivered_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="communications")
    ride = relationship("Ride", back_populates="communications")

class UserProfile(Base):
    """Stores additional user profile information."""
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    emergency_contact_name = Column(String(255))
    emergency_contact_phone = Column(String(20))
    preferred_language = Column(String(10), default="en")
    notification_preferences = Column(JSON, server_default=text("'{\"sms\": true, \"push\": true, \"email\": true}'::jsonb"))
    privacy_settings = Column(JSON, server_default=text("'{\"location_sharing\": true, \"ride_history_visible\": false}'::jsonb"))
    payment_method_id = Column(UUID(as_uuid=True), ForeignKey('payment_methods.id'))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="user_profile")
    payment_method = relationship("PaymentMethod")

class UserSession(Base):
    """Tracks user sessions for authentication."""
    __tablename__ = "user_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    token_hash = Column(String(255), nullable=False)
    refresh_token_hash = Column(String(255))
    device_info = Column(JSON)
    ip_address = Column(INET)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="sessions")

class AuditLog(Base):
    """Logs all significant system actions."""
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    action = Column(SQLAlchemyEnum(AuditActionEnum), nullable=False)
    old_values = Column(JSON)
    new_values = Column(JSON)
    ip_address = Column(INET)
    user_agent = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="audit_logs")

class AppSetting(Base):
    """Stores application configuration settings."""
    __tablename__ = "app_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    setting_key = Column(String(255), unique=True, nullable=False)
    setting_value = Column(Text, nullable=False)
    data_type = Column(SQLAlchemyEnum(DataTypeEnum), default=DataTypeEnum.string)
    description = Column(Text)
    is_public = Column(Boolean, default=False)
    updated_by = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    updated_at = Column(DateTime, server_default=func.now())
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    updated_by_user = relationship("User")

class SystemMetric(Base):
    """Tracks system performance metrics."""
    __tablename__ = "system_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_name = Column(String(255), nullable=False)
    metric_value = Column(Numeric(15, 4), nullable=False)
    metric_unit = Column(String(50))
    tags = Column(JSON, server_default=text("'{}'::jsonb"))
    recorded_at = Column(DateTime, server_default=func.now())
=======
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
>>>>>>> 2f868d27baf68fa9ba71d12ce7ba2fa2b095c3b8
