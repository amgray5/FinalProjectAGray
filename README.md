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
The Card Database must allow the following requirements to function:
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
PNG_URL:        varchar(3000)
```

## Card Data Examples (For csv input)
1. Syr Ginger, the Meal Ender
    i. Collector Number: 369
    ii. Set Code: woe
    iii. Language Code:
    iiii. Foiling: f
    iiiii. Quantity: 1
2. Solemn Simulacrum
    i. Collector Number: 1113
    ii. Set Code: sld
    iii. Language Code: jp
    iiii. Foiling: f
    iiiii. Quantity: 1
3. Clearwater Pathway // Murkwater Pathway
    i. Collector Number: 260
    ii. Set Code: znr
    iii. Language Code:
    iiii. Foiling:
    iiiii. Quantity: 1
4. Eriette of the Charmed Apple
    i. Collector Number: 299
    ii. Set Code: woe
    iii. Language Code:
    iiii. Foiling:
    iiiii. Quantity: 1

## How to Start
In a terminal window, please run the following command:
```
python app.py
```