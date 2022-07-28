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
        let firstColumn = document.querySelector(`.board[data-board-id="${boardId}"] > .board-column:nth-of-type(1)`);
        let cardOrder = document.querySelectorAll(`.board[data-board-id="${boardId}"] > .board-column:nth-of-type(1) > .card`).length + 1;
        let button = document.createElement("button");
        button.innerText = "Add card";
        button.classList.add("add-card-button");
        firstColumn.appendChild(button);
        button.addEventListener("click", () => {
            dataHandler.createNewCard(boardId, status.id, cardOrder);
            // TODO refresh page
            })
    }
};

function deleteButtonHandler(clickEvent) {
}
