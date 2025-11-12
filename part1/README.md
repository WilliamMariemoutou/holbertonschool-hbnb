# Part 1: Technical Documentation #
**Context and Objective**
In this initial phase, we will focus on creating comprehensive technical documentation that will serve as the foundation for the development of the HBnB Evolution application. This documentation will help in understanding the overall architecture, the detailed design of the business logic, and the interactions within the system.

**Problem Description**
The application will allow users to perform the following primary operations:

**User Management:** Users can register, update their profiles, and be identified as either regular users or administrators.

**Place Management:** Users can list properties (places) they own, specifying details such as name, description, price, and location (latitude and longitude). Each place can also have a list of amenities.

**Review Management:** Users can leave reviews for places they have visited, including a rating and a comment.

**Amenity Management:** The application will manage amenities that can be associated with places.

## Business Rules and Requirements ##

**User Entity**

Each user has a first name, last name, email, and password.
Users can be identified as administrators through a boolean attribute.
Users should be able to register, update their profile information, and be deleted.

**Place Entity**

Each place has a title, description, price, latitude, and longitude.
Places are associated with the user who created them (owner).
Places can have a list of amenities.
Places can be created, updated, deleted, and listed.

**Review Entity**

Each review is associated with a specific place and user, and includes a rating and comment.
Reviews can be created, updated, deleted, and listed by place.

**Amenity Entity**

Each amenity has a name, and description.
Amenities can be created, updated, deleted, and listed.
Each object should be uniquely identified by a ID.
For audit reasons, the creation and update datetime should be registered for all entities.

## Architecture and Layers ##

The application follows a layered architecture divided into:
**Presentation Layer:** This includes the services and API through which users interact with the system.

**Business Logic Layer:** This contains the models and the core logic of the application.

**Persistence Layer:** This is responsible for storing and retrieving data from the database.

### Persistence ###
All data will be persisted in a database, which will be specified and implemented in Part 3 of the project.


# HBnB - UML #

A complete set of technical documentation that provides a clear and detailed blueprint for the HBnB Evolution application. This documentation will not only guide you through the implementation phases but also ensure that you have a solid understanding of the application’s design and architecture.


## Part 1: Technical Documentation: ##
https://docs.google.com/document/d/1Bxd6bMBMDjJ9oqW4MzW1oGtKb_mWs9SpjHhFxnLvwC0/edit?usp=sharing

### Resources: ###
UML Basics

[Concept Page] OOP - Introduction to UML
Package Diagrams

UML Package Diagram Overview
UML Package Diagrams Guide
Class Diagrams

UML Class Diagram Tutorial
How to Draw UML Class Diagrams
Sequence Diagrams

UML Sequence Diagram Tutorial
Understanding Sequence Diagrams
General Diagram Tools

Mermaid.js Documentation
draw.io