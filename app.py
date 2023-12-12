from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from DatabaseConnection import mtg_database
import csv
from io import TextIOWrapper
import requests

import sqlite3

app = Flask(__name__)

def initialize_database():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    username TEXT PRIMARY KEY,
                    password TEXT
                )''')

    c.execute("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", ('Oni', 'Urza'))
    c.execute("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", ('Nyx', 'Chandra'))

    conn.commit()
    conn.close()

initialize_database()

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute("SELECT password FROM users WHERE username = ?", (username,))
    stored_password = c.fetchone()

    conn.close()

    if stored_password and password == stored_password[0]:
        if username == 'Oni':
            return redirect(url_for('oni_database'))
        elif username == 'Nyx':
            return redirect(url_for('nyx_database'))
    else:
        return render_template('login.html')

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/oni_database')
def oni_database():
    cursor = mtg_database.cursor()
    cursor.execute("SELECT * FROM Oni_Collection")
    rows = cursor.fetchall()  # Fetch all rows

    return render_template('oni_database.html', rows=rows)

@app.route('/nyx_database')
def nyx_database():
    return "Welcome to Nyx's Database"

@app.route('/logout', methods=['POST'])
def logout():
    # Perform logout actions here
    mtg_database.commit()

    # Redirect the user to the login page
    return redirect(url_for('index'))

@app.route('/delete_cards/<table_name>', methods=['POST'])
def delete_cards(table_name):
    selected_rows = request.form.getlist('selected_rows')

    with open('test.txt', 'w') as file:
        file.write(str(selected_rows))

    if table_name == 'oni':
        delete_query = "DELETE FROM Oni_Collection WHERE Database_ID = %s"
    elif table_name == 'nyx':
        delete_query = "DELETE FROM Nyx_Collection WHERE Database_ID = %s"
    else:
        return "Table not found"

    cursor = mtg_database.cursor()

    try:
        for row_id in selected_rows:
            cursor.execute(delete_query, (row_id,))

        mtg_database.commit()
        cursor.close()

        if table_name == 'oni':
            return redirect(url_for('oni_database'))
        elif table_name == 'nyx':
            return redirect(url_for('nyx_database'))
        else:
            return "Table not found"

    except Exception as e:
        mtg_database.rollback()
        error_msg = str(e)
        return f"<script>handleDeletionError('{error_msg}');</script>"

@app.route('/download/<path:filename>')
def download_file(filename):
    return send_from_directory('csvs', filename)

@app.route('/add_cards/<table_name>', methods=['POST'])
def add_cards(table_name):
    uploaded_file = request.files['csvFile']
    text_stream = TextIOWrapper(uploaded_file, encoding='utf-8')
    csv_data = csv.reader(text_stream, delimiter=',')

    next(csv_data)

    for row in csv_data:
        collector_number = row[0]
        set_code = row[1]
        language_code = 'en' if row[2] == '' else 'ja' if row[2] == 'jp' else row[2]
        foiling = 'None' if row[3] == '' else row[3]
        quantity = row[4]

        response = requests.get(f'https://api.scryfall.com/cards/{set_code}/{collector_number}/{language_code}')
        json_obj = response.json()

        #Get Card specifics to add to database
        card_name = json_obj['name']

        if foiling == 'None':
            price = json_obj['prices']['usd']
        elif foiling.lower() == 'f':
            price = json_obj['prices']['usd_foil']
            foiling = 'Foiled'
        elif foiling.lower() == 'e':
            price = json_obj['prices']['usd_etched']
            foiling = 'Etched'
        else:
            price = 0.00

        card_type = json_obj['type_line']
        set_name  = json_obj['set_name']

        try:
            if json_obj['mana_cost'] == '':
                cmc = ''
            else:
                cmc = json_obj['mana_cost']
        except KeyError:
            if json_obj['card_faces'][0]['mana_cost'] == '':
                cmc = ''
            else:
                cmc = json_obj['card_faces'][0]['mana_cost']

        if json_obj['color_identity'] == '[]':
            color_id = 'Colorless'
        else:
            color_id  = str(json_obj['color_identity']).replace("[", '').replace("]", '').replace("'", '')

        try:
            tcg_id    = json_obj['tcgplayer_id']
        except KeyError:
            tcg_id    = 0

        try:
            png_url = json_obj['image_uris']['png']
        except KeyError:
            png_url = json_obj['card_faces'][0]['image_uris']['png']

        #Connect to database
        cursor = mtg_database.cursor()

        if table_name == 'oni':
            add_query = """INSERT INTO Oni_Collection (CardName, Foiling, Price, Type, CMC, SetName, ColorIdentity, SetCode, ColNum, LangCode, TCG_ID, PNG_URL)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """
        elif table_name == 'nyx':
            add_query = """INSERT INTO Nyx_Collection (CardName, Foiling, Price, Type, CMC, SetName, ColorIdentity, SetCode, ColNum, LangCode, TCG_ID, PNG_URL)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """

        values = (card_name, foiling, price, card_type, cmc, set_name, color_id, set_code, collector_number, language_code, tcg_id, png_url)

        for i in range(0, int(quantity)):
            cursor.execute(add_query, values)
            mtg_database.commit()

        response.close()

    return 'CSV file uploaded and data processed successfully'


if __name__ == '__main__':
    app.run(debug=True)
