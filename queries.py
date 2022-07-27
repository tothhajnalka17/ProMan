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
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def insert_board(board_title):
    data_manager.execute_query("""
    Insert INTO boards(title)
    VALUES (%(board_title)s);
    """, {"board_title": board_title})


def update_table_name(board_id, new_board_name):
    data_manager.execute_query("""
    UPDATE boards
    SET title = %(new_board_name)s
    WHERE id = %(board_id)s
    """, {"board_id": board_id, "new_board_name": new_board_name})


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def get_statuses_for_board(board_id):
    statuses = data_manager.execute_select(
        """
        SELECT statuses.id, statuses.title, statuses.column_order
        FROM statuses
        JOIN boards
        ON statuses.board_id = boards.id
        WHERE board_id = %(board_id)s
        """
        , {"board_id": board_id})

    return statuses


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
