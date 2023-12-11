from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from DatabaseConnection import mtg_database

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
    # Perform deletion of selected rows from the specified table

    if table_name == 'oni':
        delete_query = "DELETE FROM Oni_Collection WHERE Database_ID = %s"

    elif table_name == 'nyx':
        delete_query = "DELETE FROM Nyx_Collection WHERE Database_ID = %s"
    else:
        # Handle if the table name is not recognized
        return "Table not found"

    # Execute the deletion query for each selected row ID
    cursor = mtg_database.cursor()
    for row_id in selected_rows:
        cursor.execute(delete_query, (row_id,))

    mtg_database.commit()

    # Redirect back to the respective database page after deletion
    if table_name == 'oni':
        return redirect(url_for('oni_database'))
    elif table_name == 'nyx':
        return redirect(url_for('nyx_database'))
    else:
        # Handle if the table name is not recognized
        return "Table not found"

@app.route('/download/<path:filename>')
def download_file(filename):
    return send_from_directory('csvs', filename)

@app.route('/add_cards/oni', methods=['POST'])
def add_cards():
    uploaded_file = request.files['csvFile']
    # Process the uploaded CSV file
    # Perform necessary actions like parsing the CSV, extracting data, and adding cards to the database
    # ...

    return "CSV uploaded and processed successfully"

if __name__ == '__main__':
    app.run(debug=True)
