### HBnB API Project

This project is the beginning of my HBnB API.
Right now, it mostly contains the project structure and the basic Flask setup.
There are no real features yet, but everything is prepared so I can add them later.

## Project Structure

Here’s what each folder/file is for, explained simply:

- **app/** – main app folder
- **app/api/** – this will have the API endpoints (users, places, reviews, amenities)
- **app/models/** – will store the classes for the project
- **app/services/** – contains the Facade, which lets different parts of the app talk to each other
- **app/persistence/** – has the in-memory repository (used for now before adding a real database)
- **run.py** – file used to start the Flask app
- **config.py** – stores app configuration
- **requirements.txt** – list of Python packages to install

## Installation
First, install the required packages:
~~
pip install -r requirements.txt

## How to run the app
To start the application, run:
~~
python run.py

This will launch the Flask server.
