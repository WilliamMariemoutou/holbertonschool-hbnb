# HBnB - UML #

## Example of a generic package diagram using Mermaid.js: ##

```
classDiagram
class PresentationLayer {
    <<Interface>>
    +ServiceAPI
}
class BusinessLogicLayer {
    +ModelClasses
}
class PersistenceLayer {
    +DatabaseAccess
}
PresentationLayer --> BusinessLogicLayer : Facade Pattern
BusinessLogicLayer --> PersistenceLayer : Database Operations
```
## Example of a generic sequence diagram using Mermaid.js: ##
```
sequenceDiagram
participant User
participant API
participant BusinessLogic
participant Database

User->>API: API Call (e.g., Register User)
API->>BusinessLogic: Validate and Process Request
BusinessLogic->>Database: Save Data
Database-->>BusinessLogic: Confirm Save
BusinessLogic-->>API: Return Response
API-->>User: Return Success/Failure
```

## Part 1: Technical Documentation: ##
https://docs.google.com/document/d/1Bxd6bMBMDjJ9oqW4MzW1oGtKb_mWs9SpjHhFxnLvwC0/edit?usp=sharing