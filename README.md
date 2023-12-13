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
## Database Configuration:
The Card Database must have the following columns and datatypes to function.
Database_ID is the Primary Key.
```
Column Name |       Datatype
==============================================
Database_ID:    int(11)
CardName:       varchar(255)
Foiling:        set('None','Foiled','Etched')
Price:          decimal(10,2)
Type:           varchar(255)
CMC:            varchar(255)
SetName:        varchar(255)
ColorIdentity:  varchar(20)
SetCode:        varchar(10)
ColNum:         varchar(10)
LangCode:       varchar(10)
TCG_ID:         int(11)
Photo_URL:      varchar(3000)
```

## Card Data Examples (For csv input)
1. Syr Ginger, the Meal Ender
    - Collector Number: 369
    - Set Code: woe
    - Language Code:
    - Foiling: f
    - Quantity: 1
2. Solemn Simulacrum
    - Collector Number: 1113
    - Set Code: sld
    - Language Code: jp
    - Foiling: f
    - Quantity: 1
3. Clearwater Pathway // Murkwater Pathway
    - Collector Number: 260
    - Set Code: znr
    - Language Code:
    - Foiling:
    - Quantity: 1
4. Eriette of the Charmed Apple
    - Collector Number: 299
    - Set Code: woe
    - Language Code:
    - Foiling:
    - Quantity: 1

## How to Start
In a terminal window, please run the following command:
```
python app.py
```