import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database
    return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    # remove this code once you implement the database
    return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def get_user_by_email(email):
    user_select = data_manager.execute_select(
        """
        SELECT * FROM users
        WHERE users.email = %(email)s
        ;
        """
        , {"email": email})

    return user_select


def get_user_encrypted_password(username):
    encrypted_pass = data_manager.execute_select(
        """
        SELECT encrypted_password FROM users
        WHERE username = %{username}s 
        """
        , {"username": username})

    return encrypted_pass


def get_user_id_by(email):
    user_select = data_manager.execute_select(
        """
        SELECT id FROM users
        WHERE email = %(email)s;
        """
        , {'email': email})

    return user_select


def get_username_by(email):
    user_select = data_manager.execute_select(
        """
        SELECT username FROM users
        WHERE email = %(email)s;
        """
        , {'email': email})

    return user_select


def get_user_by_username(username):
    user_select = data_manager.execute_select(
        """
        SELECT * FROM users
        WHERE username = %(username)s
        """
        , {'username': username})

    return user_select


def insert_users(username, email, encrypted_password, register_date):
    data_manager.execute_insert("""
    INSERT INTO users (username, email, encrypted_password, register_date) 
    VALUES (%(username)s, %(email)s, %(encrypted_password)s, %(register_date)s);
    """,
        {
            'username': username,
            'email': email,
            'encrypted_password': encrypted_password,
            'register_date': register_date
        })
