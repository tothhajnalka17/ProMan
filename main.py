from flask import Flask, render_template, url_for, request, Response, redirect, session, flash, jsonify
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries
import util
import datetime
import re
import data_manager

mimetypes.add_type('application/javascript', '.js')

app = Flask(__name__)
load_dotenv()
app.secret_key = "sajtosmakaroni"
app.permanent_session_lifetime = datetime.timedelta(minutes=1)


@app.route("/")
def index():
    return render_template('index.html')


"""
USERS
"""


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


@app.route("/signup", methods=["POST", "GET"])
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
            return render_template('signup.html')

        elif isEmailTaken:
            flash('this email is already in use')
            return render_template('signup.html')

        elif not request.form.get("username") or not request.form.get("email") or not request.form.get("password"):
            flash('Fill out the registration form properly!')
            return render_template('signup.html')

        elif not re.fullmatch(emailRegex, email):
            flash('Invalid email address!')
            return render_template('signup.html')

        elif not re.match(usernameRegex, username):
            flash('Username must contain only characters and numbers!')
            return render_template('signup.html')

        elif len(username) <= 2:
            flash('Username must be at least 2 characters long!')
            return render_template('signup.html')

        elif len(original_password) <= 5:
            flash('Password must be at least 6 characters long!')
            return render_template('signup.html')

        else:
            # Handle registration, adding to DB

            encrypted_password = util.hash_password(original_password)
            register_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            queries.insert_users(username, email, encrypted_password, register_date)
            flash('Registration successful!')

            return redirect(url_for('index'))

    elif request.method == 'POST':
        # Form is empty
        flash('Please fill out the form!')
        return render_template('signup.html')

    else:
        return render_template('signup.html')


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    user = session['username']
    flash(f'Goodbye {user}')
    session.pop("username", None)
    return redirect(url_for('index'))


"""
BOARDS
"""


@app.route("/api/boards")
@json_response
def get_boards():
    return queries.get_boards()


@app.route('/api/boards/update_board_name', methods=["POST"])
def update_board_name():
    queries.update_board_name(request.form.get("boardId"), request.form.get("newBoardName"))
    return Response(status=200)


@app.route("/api/boards/<int:board_id>", methods=["GET", "POST", "DELETE"])
def boards_routes(board_id: int):
    if request.method == "GET":
        return jsonify(queries.get_cards_for_board(board_id))
    elif request.method == "POST":
        board_id = queries.insert_board(request.form.get("boardTitle"))["id"]
        queries.insert_status("New", board_id, 1)
        queries.insert_status("In Progress", board_id, 2)
        queries.insert_status("Testing", board_id, 3)
        queries.insert_status("Done", board_id, 4)
        return Response(status=200)

    elif request.method == "DELETE":
        return jsonify(queries.delete_board(board_id))


"""
COLUMNS
"""


@app.route('/api/status/insert')
def insert_status():
    queries.insert_status(request.form.get("name"), request.form.get("boardId"), request.form.get("columnOrder"))
    return Response(status=200)


@app.route("/api/status/<int:board_id>", methods=["GET"])
@json_response
def get_statuses(board_id: int):
    return queries.get_statuses_for_board(board_id)


@app.route("/api/status/update_status_name", methods=["POST"])
def update_status_name():
    queries.update_status_name(request.form.get("id"), request.form.get("name"))
    return Response(status=200)


@app.route("/api/status/<int:status_id>/delete", methods=["DELETE"])
@json_response
def delete_status(status_id: int):
    return queries.delete_status(status_id)


"""
CARDS
"""


@app.route('/api/cards/<int:id>')
@json_response
def get_card(id):
    return queries.get_card(id)


@app.route('/api/cards/insert', methods=["POST"])
def insert_card():
    board_id = request.form.get("boardId")
    status_id = request.form.get("statusId")
    card_order = request.form.get("cardOrder")
    return jsonify(queries.insert_card(board_id, status_id, card_order))


@app.route('/api/cards/<int:id>/update', methods=["POST"])
def update_card(id):
    status_id = request.form.get("statusId")
    board_id = request.form.get("boardId")
    title = request.form.get("title")
    card_order = request.form.get("cardOrder")
    queries.update_card(id, board_id, status_id, title, card_order)
    return Response(status=200)


@app.route('/api/cards/<int:id>/delete', methods=["DELETE"])
@json_response
def delete_card(id):
    return queries.delete_card(id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
