import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            let index = card.status_id;
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            let parentColumn = document.querySelector(`.board[data-board-id="${boardId}"] > .board-column:nth-of-type(${index})`);
            domManager.addChild(`.board[data-board-id="${boardId}"] > .board-column:nth-of-type(${index})`, content);
            parentColumn.classList.add('ourColumn');
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
        }

    },
    insertAddCardButton: function (boardId, status) {
        // TODO select column based on its id value, not the nth-of type
        // TODO Insert button at the top of the column, not the end
        let firstColumn = document.querySelector(`.board[data-board-id="${boardId}"] > .board-column:nth-of-type(1)`);
        let cardOrder = document.querySelectorAll(`.board[data-board-id="${boardId}"] > .board-column:nth-of-type(1) > .card`).length + 1;
        let button = document.createElement("button");
        button.innerText = "Add card";
        button.classList.add("add-card-button");
        firstColumn.appendChild(button);
        button.addEventListener("click", () => {
            insertCard(boardId, status.id, cardOrder);
            })
    },
    cardRenameControl: function () {
        let cardDivs = Array.from(document.querySelectorAll(".card"));
        cardDivs.forEach(cardDiv => {
            cardDiv.addEventListener("click", () => {
                renameCardHandler(cardDiv)
            })
        })
    }
};

function deleteButtonHandler(clickEvent) {
}

function renameCardHandler (cardDiv) {
    let cardId = cardDiv.dataset["cardId"];
    let cardTitle = cardDiv.innerText;
    const formBuilder = htmlFactory(htmlTemplates.renameForm);

    let newDiv = document.createElement("div");
    newDiv.innerHTML = formBuilder(cardTitle);
    newDiv.classList.add("card");

    cardDiv.replaceWith(newDiv);

    let inputField = document.querySelector(".card > form > input");
    inputField.focus();

    inputField.addEventListener("focusout", async () => {
        cardDiv.innerText = inputField.value;
        newDiv.replaceWith(cardDiv)
        try {
            let card = await dataHandler.getCard(cardId);
            await dataHandler.updateCard(cardId, card.status_id, inputField.value, card.card_order);
        }
        catch (error) {
            console.log(`There was an error during the card name update: ${error}`);
        }
    });

}

async function insertCard(boardId, statusId, cardOrder) {
    try{
        let response = await dataHandler.createNewCard(boardId, statusId, cardOrder);
        let cardResponse = await response.json();
        let card = await dataHandler.getCard(cardResponse["id"]);

        const cardBuilder = htmlFactory(htmlTemplates.card);
        let content =  cardBuilder(card);
        domManager.addChild(`.board[data-board-id="${boardId}"] > .board-column:nth-of-type(1)`, content);
    }
    catch (error) {
        console.log("An error has occurred during card insertion:");
        console.log(error);
    }
}