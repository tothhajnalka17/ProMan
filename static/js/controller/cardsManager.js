import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        await add_statuses(boardId)
        for (let card of cards) {
            let index = card.status_id;
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            let parent = document.querySelector(`.board[data-board-id="${boardId}"] > .board-column:nth-of-type(${index})`);
            domManager.addChild(`.board[data-board-id="${boardId}"] > .board-column:nth-of-type(${index})`, content);
            parent.classList.add('ourColumn');
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
        }

    },
};

function deleteButtonHandler(clickEvent) {
}

async function add_statuses(boardId){
    const statuses = await dataHandler.getStatuses(boardId)
    const headers = document.getElementsByTagName("h4");
    if (headers.length === 0){
        for (let i=0; i<statuses.length; i++) {
            const title = document.createElement("h4")
            title.classList.add("column-header");
            console.log(statuses[i]);
            title.setAttribute("data-status-id", statuses[i].id);
            title.innerText = statuses[i].title
            let parent = document.querySelector(`.board[data-board-id="${boardId}"] > .board-column:nth-of-type(${i + 1})`);
            parent.insertBefore(title, parent.firstChild)
        }
    }
}
