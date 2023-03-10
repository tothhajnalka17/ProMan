import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {initDraggable} from "./dragNDropManager.js";
import {resetTitle} from "./util.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            let index = card.status_id;
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);

            domManager.addChild(`.board-column[data-column-id="${index}"]`, content);
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "click",
            );
        }
    },
    insertAddCardButton: function (boardId, status) {
        let firstColumn = document.querySelector(`.board-column[data-column-id="${status.id}"]`);
        let cardOrder = document.querySelectorAll(`.board-column[data-column-id="${status.id}"] > .card`).length + 1;
        let button = document.createElement("i");
        button.innerText = " Add card";
        button.classList.add("fa");
        button.classList.add("fa-plus")
        button.classList.add("bicon")
        firstColumn.insertBefore(button, firstColumn.firstChild.nextSibling);
        button.addEventListener("click", () => {
            insertCard(boardId, status.id, cardOrder);
            })
    },

    cardRenameControl: function () {
        let cardTitleDivs = Array.from(document.querySelectorAll("div.card-title"));
        cardTitleDivs.forEach(cardTitleDiv => {
            initCardRename(cardTitleDiv);
        })
    },

    initDeleteCards: function () {
    let deleteIcons = Array.from(document.querySelectorAll(".delI"))
        deleteIcons.forEach((icon)=>{
            addDeleteFunctionality(icon);
        })
}
};

function initCardRename(cardTitleDiv) {
    if (cardTitleDiv.hasClick === "true" ) {
        return;
    }
    cardTitleDiv.addEventListener("click", () => {
        cardTitleDiv.hasClick = "true"
        let oldTitle = cardTitleDiv.innerText;
        if (cardTitleDiv.hasFocusOutListener === "true") {
            return;
        }
        cardTitleDiv.addEventListener("focusout", () => {
            cardTitleDiv.hasFocusOutListener = "true";
            if (cardTitleDiv.properSubmission !== "true") {
                resetTitle(oldTitle, cardTitleDiv);
            }
            cardTitleDiv.properSubmission = "false";
        });
        cardTitleDiv.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                cardTitleDiv.properSubmission = "true";
                event.preventDefault();
                let cardId = event.target.parentElement.dataset.cardId;
                let boardId = event.target.parentElement.dataset.boardId;
                let statusId = event.target.parentElement.dataset.statusId;
                let cardOrder = event.target.parentElement.dataset.cardOrder;
                let newTitle = cardTitleDiv.innerText;
                oldTitle = newTitle;
                try {
                    await dataHandler.updateCard(cardId, boardId, statusId, newTitle, cardOrder);
                } catch (error) {
                    console.log(`There was an error during the board name update: ${error}`);
                } finally {
                    event.target.blur();
                }
            }
        })
    })
}

function addDeleteFunctionality(icon) {
    let trashId = icon.dataset.trashId
    icon.addEventListener("click", e => {
        dataHandler.deleteCard(trashId);
        e.stopPropagation();
        e.target.parentElement.parentElement.remove();
    })
}

async function insertCard(boardId, statusId, cardOrder) {
    try{
        let response = await dataHandler.createNewCard(boardId, statusId, cardOrder);
        let cardResponse = await response.json();
        let card = await dataHandler.getCard(cardResponse["id"]);

        const cardBuilder = htmlFactory(htmlTemplates.card);
        let content =  cardBuilder(card);
        domManager.addChild(`.board-column[data-column-id="${statusId}"]`, content);
        let cardElement = document.querySelector(`.board-column[data-column-id="${statusId}"]`).lastChild;
        initDraggable(cardElement);
        initCardRename(cardElement.querySelector("div.card-title"));
        addDeleteFunctionality(cardElement.querySelector("i.delI"));
    }
    catch (error) {
        console.log("An error has occurred during card insertion:");
        console.log(error);
    }
}
