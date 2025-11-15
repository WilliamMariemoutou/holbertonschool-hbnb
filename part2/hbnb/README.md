# HBnB API Project

This project is the beginning of my HBnB API.  
Right now, it contains the project structure, basic Flask setup, and the first business logic classes.  
More features will be added later.

---

## Project Structure

Here’s what each folder/file is for:

- **app/** – main app folder  
- **app/api/** – API endpoints (users, places, reviews, amenities)  
- **app/models/** – contains the Python classes (User, Place, Review, Amenity)  
- **app/services/** – Facade layer that connects models to the API  
- **app/persistence/** – In-memory repository (temporary "database")  
- **run.py** – starts the Flask app  
- **config.py** – app configurations  
- **requirements.txt** – Python packages to install  

---

## Installation

First, install the required packages:

```bash
pip install -r requirements.txt
```
---

## How to Run the App

```bash
python3 run.py
```



## Core Business Logic

In this project, I implemented four main classes:

- User

- Place

- Review

- Amenity

All classes inherit from a BaseModel that gives them:

- a unique ID (UUID)

- created_at timestamp

- updated_at timestamp

- save() and update() helpers

UUIDs ensure every object has a globally unique ID.

## BaseModel

Every class extends BaseModel and gets:

- id → unique string (UUID)

- created_at → when the object was created

- updated_at → last time the object was modified

- save() → refresh updated_at

- update(data) → update attributes from a dictionary

## User Class

**Attributes:**

- id (UUID)

- first_name (required, max 50 chars)

- last_name (required, max 50 chars)

- email (required, unique, must be valid)

- is_admin (boolean, default False)

- created_at

- updated_at

## Place Class

**Attributes:**

- id (UUID)

- title (required, max 100 chars)

- description (optional)

- price (float, must be positive)

- latitude (float, -90 to 90)

- longitude (float, -180 to 180)

- owner (User instance)

- created_at

- updated_at

**Relationships:**

- A Place has many Reviews

- A Place has many Amenities

## Review Class

**Attributes:**

- id

- text (required)

- rating (1–5)

- place (Place instance)

- user (User instance)

- created_at

- updated_at

## Amenity Class

**Attributes:**

- id

- name (required, max 50 chars)

- created_at

- updated_at
