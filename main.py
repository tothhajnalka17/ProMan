from flask import Flask, render_template, url_for, flash, request, redirect, session
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
    # Check if "username" and "password" POST requests exist (user submitted form)
    if request.method == 'POST' and 'email' in request.form and 'password' in request.form:
        email = request.form['email']
        password = request.form['password']
        account = queries.get_user_by_email(email)
        print(account)

        if account:
            encrypted_password = queries.get_user_encrypted_password(email)
            session.permanent = True
            userdata = queries.get_username_by(email)
            for username in userdata[0].values():
                pass
            session['username'] = username

            userid = queries.get_user_id_by(email)
            for id in userid[0].values():
                pass
            session['id'] = id
            print(id)
            # If account exists in users table in out database
            if util.verify_password(password, encrypted_password):
                print("Passwords match")
                # Create session data, we can access this data in other routes
                # Redirect to home page
                return redirect(url_for('route_home'))
            elif 'user' in session:
                return redirect(url_for('route_home'))

            else:
                # Account doesnt exist or username/password incorrect
                flash('Incorrect username/password')
                return redirect(url_for('userlogin'))
        else:
            # Account doesnt exist or username/password incorrect
            flash('Incorrect username/password')
            return redirect(url_for('userlogin'))

    return render_template('login.html')




@app.route("/signup")
def signup():
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form:
        username = request.form.get('username')
        email = request.form.get('email')
        original_password = request.form.get('password')

        isUsernameTaken = queries.get_user_by_username(request.form.get('username'))
        isEmailTaken = queries.get_user_by_email(request.form.get('email'))
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

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    user = session['username']
    flash(f'Goodbye {user}')
    session.pop("username", None)
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
