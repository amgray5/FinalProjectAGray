# FinalProjectAGray

INF601 Advanced Programing with Python

Austin Gray

## Description
This project is an example of a online portal for Magic the Gathering game stores. It connects to a MySQL database specified in a mtg_database function of a DatabaseConnection.py (example included).

## Functions
- Add Cards to Database
    - Requires .csv input
        - Template downloadable
- Delete Cards from Database
- Search Table
- Sort Table
    - "Select", "CMC", and "PNG URL" columns are not sortable
- Logout
    - Takes you back to login and closes database connection

## Pip Install Instructions
Please run the following:
```
pip install -r requirements.txt
```

## How to Start
In a terminal window, please run the following command:
```
python app.py
```