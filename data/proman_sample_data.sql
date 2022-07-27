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
    board_id INTEGER                NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL
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

INSERT INTO statuses(title, board_id) VALUES ('new', 1);
INSERT INTO statuses(title, board_id) VALUES ('in progress', 1);
INSERT INTO statuses(title, board_id) VALUES ('testing', 1);
INSERT INTO statuses(title, board_id) VALUES ('done', 1);
INSERT INTO statuses(title, board_id) VALUES ('no status', 2);
INSERT INTO statuses(title, board_id) VALUES ('lost', 2);
INSERT INTO statuses(title, board_id) VALUES ('forgotten', 2);
INSERT INTO statuses(title, board_id) VALUES ('unnecessary', 2);

INSERT INTO boards(title) VALUES ('Board 1');
INSERT INTO boards(title) VALUES ('Board 2');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'who knows', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'whatever', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 2, 'not a card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 3, 'unplanned', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'unexpected', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'undo', 2);

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

ALTER TABLE ONLY statuses
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;
