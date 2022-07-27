import {dataHandler} from "../data/dataHandler.js";
import {builderFunctions, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
        }
    },
    boardRenameControl: function() {
        let headerDivs = Array.from(document.querySelectorAll(".board-header"));
        headerDivs.forEach(headerDiv => {
            headerDiv.addEventListener("click", () => {
                renameBoardHandler(headerDiv);
            })
        })
    }
};



function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    cardsManager.loadCards(boardId);

    let i = clickEvent.target;
    i.removeEventListener("click", showHideButtonHandler)
    i.classList.remove("fa-chevron-down")
    i.classList.add("fa-chevron-up")

    i.addEventListener("click", event => {
        event.preventDefault();
        domManager.refreshPage();
    })
}

function renameBoardHandler (headerDiv) {
    let boardId = headerDiv.getAttribute("data-header-id");
    let boardTitle = headerDiv.innerText;
    const formBuilder = htmlFactory(htmlTemplates.renameForm);

    let newDiv = document.createElement("div");
    newDiv.innerHTML = formBuilder(boardTitle);
    newDiv.classList.add("board-header");

    headerDiv.replaceWith(newDiv);

    // Add focus to the main input field and listen to focus loss
    let inputField = document.querySelector(".board-header > form > input");
    inputField.focus();

    inputField.addEventListener("focusout", async () => {
        headerDiv.innerText = inputField.value;
        newDiv.replaceWith(headerDiv)
        try {
            await dataHandler.updateBoardName(boardId, inputField.value);
        }
        catch (error) {
            console.log(`There was an error during the board name update: ${error}`);
        }
    });
}
