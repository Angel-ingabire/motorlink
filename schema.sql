<<<<<<< HEAD
--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: approval_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.approval_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected',
    'suspended'
);


ALTER TYPE public.approval_status_enum OWNER TO postgres;

--
-- Name: audit_action_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.audit_action_enum AS ENUM (
    'create',
    'update',
    'delete',
    'view'
);


ALTER TYPE public.audit_action_enum OWNER TO postgres;

--
-- Name: background_check_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.background_check_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.background_check_status_enum OWNER TO postgres;

--
-- Name: cancellation_source_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.cancellation_source_enum AS ENUM (
    'passenger',
    'driver',
    'system'
);


ALTER TYPE public.cancellation_source_enum OWNER TO postgres;

--
-- Name: communication_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.communication_status_enum AS ENUM (
    'pending',
    'sent',
    'delivered',
    'failed',
    'bounced'
);


ALTER TYPE public.communication_status_enum OWNER TO postgres;

--
-- Name: communication_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.communication_type_enum AS ENUM (
    'sms',
    'email',
    'push_notification',
    'phone_call'
);


ALTER TYPE public.communication_type_enum OWNER TO postgres;

--
-- Name: data_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.data_type_enum AS ENUM (
    'string',
    'integer',
    'decimal',
    'boolean',
    'json'
);


ALTER TYPE public.data_type_enum OWNER TO postgres;

--
-- Name: delivery_method_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.delivery_method_enum AS ENUM (
    'push',
    'sms',
    'email',
    'in_app'
);


ALTER TYPE public.delivery_method_enum OWNER TO postgres;

--
-- Name: delivery_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.delivery_status_enum AS ENUM (
    'pending',
    'sent',
    'delivered',
    'failed'
);


ALTER TYPE public.delivery_status_enum OWNER TO postgres;

--
-- Name: document_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.document_type_enum AS ENUM (
    'license',
    'insurance',
    'vehicle_registration',
    'background_check'
);


ALTER TYPE public.document_type_enum OWNER TO postgres;

--
-- Name: driver_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.driver_status_enum AS ENUM (
    'offline',
    'online',
    'busy'
);


ALTER TYPE public.driver_status_enum OWNER TO postgres;

--
-- Name: gender_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender_enum AS ENUM (
    'male',
    'female',
    'other'
);


ALTER TYPE public.gender_enum OWNER TO postgres;

--
-- Name: gender_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender_type AS ENUM (
    'male',
    'female',
    'other'
);


ALTER TYPE public.gender_type OWNER TO postgres;

--
-- Name: location_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.location_type_enum AS ENUM (
    'district',
    'sector',
    'landmark',
    'business',
    'transport_hub'
);


ALTER TYPE public.location_type_enum OWNER TO postgres;

--
-- Name: method_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.method_type_enum AS ENUM (
    'mobile_money',
    'bank_card',
    'cash'
);


ALTER TYPE public.method_type_enum OWNER TO postgres;

--
-- Name: notification_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type_enum AS ENUM (
    'ride_request',
    'driver_assigned',
    'driver_arrived',
    'ride_started',
    'ride_completed',
    'payment_completed',
    'system_announcement'
);


ALTER TYPE public.notification_type_enum OWNER TO postgres;

--
-- Name: payment_method_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method_enum AS ENUM (
    'cash',
    'mobile_money',
    'card'
);


ALTER TYPE public.payment_method_enum OWNER TO postgres;

--
-- Name: payment_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status_enum AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE public.payment_status_enum OWNER TO postgres;

--
-- Name: payment_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_type_enum AS ENUM (
    'ride_fare',
    'tip',
    'cancellation_fee',
    'refund'
);


ALTER TYPE public.payment_type_enum OWNER TO postgres;

--
-- Name: payout_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payout_status_enum AS ENUM (
    'pending',
    'paid',
    'hold'
);


ALTER TYPE public.payout_status_enum OWNER TO postgres;

--
-- Name: provider_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.provider_enum AS ENUM (
    'mtn',
    'airtel',
    'tigo',
    'visa',
    'mastercard'
);


ALTER TYPE public.provider_enum OWNER TO postgres;

--
-- Name: provider_service_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.provider_service_enum AS ENUM (
    'twilio',
    'sendgrid',
    'firebase',
    'local'
);


ALTER TYPE public.provider_service_enum OWNER TO postgres;

--
-- Name: review_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.review_type_enum AS ENUM (
    'passenger_to_driver',
    'driver_to_passenger'
);


ALTER TYPE public.review_type_enum OWNER TO postgres;

--
-- Name: ride_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.ride_status_enum AS ENUM (
    'requested',
    'driver_assigned',
    'driver_arrived',
    'in_progress',
    'completed',
    'cancelled'
);


ALTER TYPE public.ride_status_enum OWNER TO postgres;

--
-- Name: status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_enum AS ENUM (
    'active',
    'suspended',
    'deleted'
);


ALTER TYPE public.status_enum OWNER TO postgres;

--
-- Name: status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_type AS ENUM (
    'active',
    'suspended',
    'deleted'
);


ALTER TYPE public.status_type OWNER TO postgres;

--
-- Name: user_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_type AS ENUM (
    'passenger',
    'driver'
);


ALTER TYPE public.user_type OWNER TO postgres;

--
-- Name: user_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_type_enum AS ENUM (
    'passenger',
    'driver'
);


ALTER TYPE public.user_type_enum OWNER TO postgres;

--
-- Name: vehicle_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vehicle_type_enum AS ENUM (
    'motorcycle',
    'car',
    'van'
);


ALTER TYPE public.vehicle_type_enum OWNER TO postgres;

--
-- Name: verification_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.verification_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.verification_status_enum OWNER TO postgres;

--
-- Name: vote_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vote_type_enum AS ENUM (
    'helpful',
    'not_helpful',
    'inappropriate'
);


ALTER TYPE public.vote_type_enum OWNER TO postgres;

--
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    setting_key character varying(255) NOT NULL,
    setting_value text NOT NULL,
    data_type public.data_type_enum DEFAULT 'string'::public.data_type_enum,
    description text,
    is_public boolean DEFAULT false,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.app_settings OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    entity_type character varying(100) NOT NULL,
    entity_id uuid NOT NULL,
    action public.audit_action_enum NOT NULL,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: communication_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.communication_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    ride_id uuid,
    communication_type public.communication_type_enum NOT NULL,
    recipient character varying(255) NOT NULL,
    content text,
    provider public.provider_service_enum NOT NULL,
    external_id character varying(255),
    status public.communication_status_enum DEFAULT 'pending'::public.communication_status_enum,
    cost_amount numeric(8,4),
    sent_at timestamp without time zone,
    delivered_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.communication_logs OWNER TO postgres;

--
-- Name: driver_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    driver_id uuid,
    document_type public.document_type_enum,
    document_url character varying(500) NOT NULL,
    verification_status public.verification_status_enum DEFAULT 'pending'::public.verification_status_enum,
    verified_by uuid,
    verified_at timestamp without time zone,
    rejection_reason text,
    expiry_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.driver_documents OWNER TO postgres;

--
-- Name: driver_earnings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_earnings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    driver_id uuid NOT NULL,
    ride_id uuid,
    gross_amount numeric(10,2) NOT NULL,
    commission_rate numeric(5,4) DEFAULT 0.20,
    commission_amount numeric(10,2) NOT NULL,
    net_amount numeric(10,2) NOT NULL,
    bonus_amount numeric(8,2) DEFAULT 0.00,
    earnings_date date NOT NULL,
    payout_status public.payout_status_enum DEFAULT 'pending'::public.payout_status_enum,
    payout_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.driver_earnings OWNER TO postgres;

--
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    license_number character varying(50) NOT NULL,
    license_expiry date NOT NULL,
    license_image_url character varying(500),
    vehicle_type public.vehicle_type_enum NOT NULL,
    vehicle_make character varying(100),
    vehicle_model character varying(100),
    vehicle_year integer,
    vehicle_plate character varying(20) NOT NULL,
    vehicle_color character varying(50),
    vehicle_image_url character varying(500),
    insurance_number character varying(100),
    insurance_expiry date,
    insurance_image_url character varying(500),
    background_check_status public.background_check_status_enum DEFAULT 'pending'::public.background_check_status_enum,
    approval_status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum,
    rating numeric(3,2) DEFAULT 0.00,
    total_rides integer DEFAULT 0,
    total_earnings numeric(12,2) DEFAULT 0.00,
    current_status public.driver_status_enum DEFAULT 'offline'::public.driver_status_enum,
    current_latitude numeric(10,8),
    current_longitude numeric(11,8),
    last_location_update timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    display_name character varying(255) NOT NULL,
    address text,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    location_type public.location_type_enum NOT NULL,
    parent_location_id uuid,
    is_active boolean DEFAULT true,
    popularity_score integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    ride_id uuid,
    type public.notification_type_enum NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    delivery_method public.delivery_method_enum NOT NULL,
    delivery_status public.delivery_status_enum DEFAULT 'pending'::public.delivery_status_enum,
    external_message_id character varying(255),
    scheduled_at timestamp without time zone,
    sent_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: payment_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_methods (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    method_type public.method_type_enum NOT NULL,
    provider public.provider_enum NOT NULL,
    account_number character varying(255) NOT NULL,
    account_name character varying(255),
    is_default boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payment_methods OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ride_id uuid,
    user_id uuid NOT NULL,
    payment_method_id uuid,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'RWF'::character varying,
    payment_type public.payment_type_enum DEFAULT 'ride_fare'::public.payment_type_enum,
    status public.payment_status_enum DEFAULT 'pending'::public.payment_status_enum,
    external_transaction_id character varying(255),
    external_reference character varying(255),
    provider_response jsonb,
    failure_reason text,
    processed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: review_votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid,
    user_id uuid NOT NULL,
    vote_type public.vote_type_enum NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.review_votes OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ride_id uuid NOT NULL,
    reviewer_id uuid NOT NULL,
    reviewed_id uuid NOT NULL,
    rating integer NOT NULL,
    review_text text,
    review_type public.review_type_enum NOT NULL,
    is_anonymous boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    inappropriate_reports integer DEFAULT 0,
    is_hidden boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: ride_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ride_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ride_id uuid,
    available_driver_ids uuid[] DEFAULT '{}'::uuid[],
    request_radius_km numeric(4,2) DEFAULT 5.0,
    max_wait_time_minutes integer DEFAULT 10,
    priority_score integer DEFAULT 100,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ride_requests OWNER TO postgres;

--
-- Name: ride_tracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ride_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ride_id uuid,
    driver_latitude numeric(10,8) NOT NULL,
    driver_longitude numeric(11,8) NOT NULL,
    passenger_latitude numeric(10,8),
    passenger_longitude numeric(11,8),
    speed_kmh numeric(5,2),
    heading_degrees integer,
    accuracy_meters numeric(6,2),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ride_tracking OWNER TO postgres;

--
-- Name: rides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rides (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    passenger_id uuid NOT NULL,
    driver_id uuid,
    ride_type public.vehicle_type_enum NOT NULL,
    pickup_location_name character varying(255) NOT NULL,
    pickup_address text,
    pickup_latitude numeric(10,8) NOT NULL,
    pickup_longitude numeric(11,8) NOT NULL,
    destination_location_name character varying(255) NOT NULL,
    destination_address text,
    destination_latitude numeric(10,8) NOT NULL,
    destination_longitude numeric(11,8) NOT NULL,
    estimated_distance_km numeric(8,2),
    actual_distance_km numeric(8,2),
    estimated_duration_minutes integer,
    actual_duration_minutes integer,
    estimated_fare numeric(8,2),
    final_fare numeric(8,2),
    surge_multiplier numeric(3,2) DEFAULT 1.00,
    status public.ride_status_enum DEFAULT 'requested'::public.ride_status_enum,
    scheduled_time timestamp without time zone,
    requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    driver_assigned_at timestamp without time zone,
    driver_arrived_at timestamp without time zone,
    ride_started_at timestamp without time zone,
    ride_completed_at timestamp without time zone,
    cancelled_at timestamp without time zone,
    cancellation_reason text,
    cancelled_by public.cancellation_source_enum,
    passenger_notes text,
    driver_notes text,
    payment_method public.payment_method_enum DEFAULT 'cash'::public.payment_method_enum,
    payment_status public.payment_status_enum DEFAULT 'pending'::public.payment_status_enum,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rides OWNER TO postgres;

--
-- Name: system_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    metric_name character varying(255) NOT NULL,
    metric_value numeric(15,4) NOT NULL,
    metric_unit character varying(50),
    tags jsonb DEFAULT '{}'::jsonb,
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.system_metrics OWNER TO postgres;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    emergency_contact_name character varying(255),
    emergency_contact_phone character varying(20),
    preferred_language character varying(10) DEFAULT 'en'::character varying,
    notification_preferences jsonb DEFAULT '{"sms": true, "push": true, "email": true}'::jsonb,
    privacy_settings jsonb DEFAULT '{"location_sharing": true, "ride_history_visible": false}'::jsonb,
    payment_method_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    token_hash character varying(255) NOT NULL,
    refresh_token_hash character varying(255),
    device_info jsonb,
    ip_address inet,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    phone_number character varying(20) NOT NULL,
    user_type public.user_type NOT NULL,
    profile_image_url character varying(500),
    date_of_birth date,
    gender public.gender_type,
    email_verified boolean DEFAULT false,
    phone_verified boolean DEFAULT false,
    status public.status_type DEFAULT 'active'::public.status_type,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- Name: app_settings app_settings_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_setting_key_key UNIQUE (setting_key);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: communication_logs communication_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communication_logs
    ADD CONSTRAINT communication_logs_pkey PRIMARY KEY (id);


--
-- Name: driver_documents driver_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_documents
    ADD CONSTRAINT driver_documents_pkey PRIMARY KEY (id);


--
-- Name: driver_earnings driver_earnings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_earnings
    ADD CONSTRAINT driver_earnings_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_license_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_license_number_key UNIQUE (license_number);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_vehicle_plate_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_vehicle_plate_key UNIQUE (vehicle_plate);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payment_methods payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: review_votes review_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_votes
    ADD CONSTRAINT review_votes_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: ride_requests ride_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_requests
    ADD CONSTRAINT ride_requests_pkey PRIMARY KEY (id);


--
-- Name: ride_tracking ride_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_tracking
    ADD CONSTRAINT ride_tracking_pkey PRIMARY KEY (id);


--
-- Name: rides rides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_pkey PRIMARY KEY (id);


--
-- Name: system_metrics system_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_metrics
    ADD CONSTRAINT system_metrics_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_drivers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_drivers_status ON public.drivers USING btree (current_status, approval_status);


--
-- Name: idx_locations_popularity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_locations_popularity ON public.locations USING btree (popularity_score DESC);


--
-- Name: idx_locations_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_locations_type ON public.locations USING btree (location_type);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id, is_read, created_at DESC);


--
-- Name: idx_payments_ride; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_ride ON public.payments USING btree (ride_id);


--
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status, created_at);


--
-- Name: idx_payments_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_user ON public.payments USING btree (user_id, created_at DESC);


--
-- Name: idx_reviews_reviewed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_reviewed ON public.reviews USING btree (reviewed_id, created_at DESC);


--
-- Name: idx_reviews_ride; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_ride ON public.reviews USING btree (ride_id);


--
-- Name: idx_rides_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rides_driver ON public.rides USING btree (driver_id, created_at DESC);


--
-- Name: idx_rides_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rides_location ON public.rides USING btree (pickup_latitude, pickup_longitude);


--
-- Name: idx_rides_passenger; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rides_passenger ON public.rides USING btree (passenger_id, created_at DESC);


--
-- Name: idx_rides_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rides_status ON public.rides USING btree (status, created_at);


--
-- Name: idx_tracking_ride_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_ride_time ON public.ride_tracking USING btree (ride_id, "timestamp" DESC);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_phone ON public.users USING btree (phone_number);


--
-- Name: idx_users_type_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_type_status ON public.users USING btree (user_type, status);


--
-- Name: drivers update_drivers_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_drivers_timestamp BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: reviews update_reviews_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_reviews_timestamp BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: rides update_rides_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_rides_timestamp BEFORE UPDATE ON public.rides FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: user_profiles update_user_profiles_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_user_profiles_timestamp BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: users update_users_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: app_settings app_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: communication_logs communication_logs_ride_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communication_logs
    ADD CONSTRAINT communication_logs_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id);


--
-- Name: communication_logs communication_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communication_logs
    ADD CONSTRAINT communication_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: driver_documents driver_documents_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_documents
    ADD CONSTRAINT driver_documents_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE CASCADE;


--
-- Name: driver_documents driver_documents_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_documents
    ADD CONSTRAINT driver_documents_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id);


--
-- Name: driver_earnings driver_earnings_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_earnings
    ADD CONSTRAINT driver_earnings_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);


--
-- Name: driver_earnings driver_earnings_ride_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_earnings
    ADD CONSTRAINT driver_earnings_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id);


--
-- Name: drivers drivers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: locations locations_parent_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_parent_location_id_fkey FOREIGN KEY (parent_location_id) REFERENCES public.locations(id);


--
-- Name: notifications notifications_ride_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payment_methods payment_methods_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id);


--
-- Name: payments payments_ride_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id);


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: review_votes review_votes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_votes
    ADD CONSTRAINT review_votes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: review_votes review_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_votes
    ADD CONSTRAINT review_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_reviewed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewed_id_fkey FOREIGN KEY (reviewed_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_ride_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id);


--
-- Name: ride_requests ride_requests_ride_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_requests
    ADD CONSTRAINT ride_requests_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id) ON DELETE CASCADE;


--
-- Name: ride_tracking ride_tracking_ride_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_tracking
    ADD CONSTRAINT ride_tracking_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id) ON DELETE CASCADE;


--
-- Name: rides rides_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);


--
-- Name: rides rides_passenger_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES public.users(id);


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

=======

>>>>>>> 75718d48233b220e975d0d496d1c057504343a44
