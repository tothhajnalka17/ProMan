from flask import Flask, render_template, url_for, flash, request, redirect
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries
import util
import data_manager
import datetime
import re

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/login", methods=["GET", "POST"])
def login():



@app.route("/signup")
def signup():
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form:
        username = request.form.get('username')
        email = request.form.get('email')
        original_password = request.form.get('password')

        isUsernameTaken = data_manager.get_user_by_username(request.form.get('username'))
        isEmailTaken = data_manager.get_user_by_email(request.form.get('email'))
        usernameRegex = re.compile(r'[A-Za-z0-9]+')
        emailRegex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')

        if isUsernameTaken:
            flash('this username is already in use')
            return render_template('register.html')

        elif isEmailTaken:
            flash('this email is already in use')
            return render_template('register.html')

        elif not request.form.get("username") or not request.form.get("email") or not request.form.get("password"):
            flash('Fill out the registration form properly!')
            return render_template('register.html')

        elif not re.fullmatch(emailRegex, email):
            flash('Invalid email address!')
            return render_template('register.html')

        elif not re.match(usernameRegex, username):
            flash('Username must contain only characters and numbers!')
            return render_template('register.html')

        elif len(username) <= 2:
            flash('Username must be at least 2 characters long!')
            return render_template('register.html')

        elif len(original_password) <= 5:
            flash('Password must be at least 6 characters long!')
            return render_template('register.html')

        else:
            # Handle registration, adding to DB
            encrypted_password = util.hash_password(original_password)
            register_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            data_manager.add_user(username, email, encrypted_password, register_date)
            flash('Registration successful!')
            return redirect(url_for('route_home'))


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


def main():
    app.run(
        debug=True,

    )

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    app.run()
