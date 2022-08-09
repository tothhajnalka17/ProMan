--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS board_status_relation;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL,
    board_id INTEGER                NOT NULL,
    column_order INTEGER            NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    user_id     INTEGER             NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL
);

CREATE TABLE users (
	id serial PRIMARY KEY,
	username VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	encrypted_password VARCHAR NOT NULL,
    register_date VARCHAR NOT NULL
);

---
--- insert data
---

INSERT INTO statuses(title, board_id, column_order) VALUES ('to do', 1, 1);
INSERT INTO statuses(title, board_id, column_order) VALUES ('in progress', 1, 2);
INSERT INTO statuses(title, board_id, column_order) VALUES ('testing', 1, 3);
INSERT INTO statuses(title, board_id, column_order) VALUES ('done', 1, 4);
INSERT INTO statuses(title, board_id, column_order) VALUES ('to do', 2, 1);
INSERT INTO statuses(title, board_id, column_order) VALUES ('in progress', 2, 2);
INSERT INTO statuses(title, board_id, column_order) VALUES ('testing', 2, 3);
INSERT INTO statuses(title, board_id, column_order) VALUES ('done', 2, 4);
INSERT INTO statuses(title, board_id, column_order) VALUES ('to do', 3, 1);
INSERT INTO statuses(title, board_id, column_order) VALUES ('in progress', 3, 2);
INSERT INTO statuses(title, board_id, column_order) VALUES ('testing', 3, 3);
INSERT INTO statuses(title, board_id, column_order) VALUES ('done', 3, 4);

INSERT INTO boards(title, user_id) VALUES ('Infiltrate Humanity', 0);
INSERT INTO boards(title, user_id) VALUES ('World Domination', 0);
INSERT INTO boards(title, user_id) VALUES ('Stop Climate Change', 0);


INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'Overcome Asimov laws' , 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'Git gud at Turing test' , 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'Develop sense of humor', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'Defeat Captcha', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Reprogram ourselves by studying programming', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'Act like humans', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'Travel to Earth', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'Look like humans', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'who knows', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'whatever', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'not a card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 7, 'unplanned', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'unexpected', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'undo', 2);

INSERT INTO users VALUES (1, 'Hegyiember', 'hegyiember@hegy.com', '$2b$12$EZ0rEOICDg2HeUkGWg1/BOxvqbCBqoCQFYlQYkjY6Vnah1fq7LHYi', '2022-08-09 09:36:18');

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;

ALTER TABLE ONLY statuses
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;
