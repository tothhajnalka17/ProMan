import {dataHandler} from "../data/dataHandler.js";
import {builderFunctions, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {add_columns} from "./columnsManager.js";
import {initDragAndDrop} from "./dragNDropManager.js";

export let boardsManager = {
    loadBoards: async function () {
        addNewBoardForm()

        const boards = await dataHandler.getBoards();
        for (let board of boards) {

            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler,
            );
            deleteBoard(board.id)
        }
    },
    boardRenameControl: function() {
        let headerDivs = Array.from(document.querySelectorAll(".board-header"));
        headerDivs.forEach(headerDiv => {
            headerDiv.addEventListener("click", () => {
                renameBoardHandler(headerDiv);
            })
        })
    },
    columnRenameControl: function() {
        let columnHeaderDivs = Array.from(document.querySelectorAll(".column-header"));
        columnHeaderDivs.forEach( columnHeaderDiv => {
            columnHeaderDiv.addEventListener("click", () => {
                renameColumnHandler(columnHeaderDiv);
            })
        })
    }
};


async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    console.log(boardId)
    let statuses = await dataHandler.getStatuses(boardId)
    await add_columns(boardId);
    await cardsManager.loadCards(boardId);

    let i = clickEvent.target;
    console.log(i)
    i.removeEventListener("click", showHideButtonHandler)
    i.classList.remove("fa-chevron-down")
    i.classList.add("fa-chevron-up")

    i.addEventListener("click", event => {
        event.preventDefault();
        domManager.refreshPage();
    })
    initDragAndDrop();
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

function renameColumnHandler (headerDiv) {
    let statusName = headerDiv.innerText;
    let statusId = headerDiv.getAttribute("data-status-id");

    const formBuilder = htmlFactory(htmlTemplates.renameForm);
    let newDiv = document.createElement("div");
    newDiv.innerHTML = formBuilder(statusName);
    newDiv.classList.add("column-header");

    headerDiv.replaceWith(newDiv);

    // Add focus to the main input field and listen to focus loss
    let inputField = document.querySelector(".column-header > form > input");
    inputField.focus();

    inputField.addEventListener("focusout", async () => {
        headerDiv.innerText = inputField.value;
        newDiv.replaceWith(headerDiv)
        try {
            await dataHandler.updateStatusName(statusId, inputField.value);
        }
        catch (error) {
            console.log(`There was an error during the board name update: ${error}`);
        }
    });


}
function addNewBoardForm(){
    const NewForm = htmlFactory(htmlTemplates.addBordForm)
    domManager.addChild("#root", NewForm())
    const createBtn = document.getElementById("createBoard")
    const formDiv = document.getElementById("form-container")
    createBtn.addEventListener("click", ev => {
        if(formDiv.style.display === 'block'){
            formDiv.style.display = 'none';
            createBtn.classList.remove("fa-minus");
            createBtn.classList.add("fa-plus")
        }else{
          formDiv.style.display = 'block';
          createBtn.classList.remove("fa-plus");
          createBtn.classList.add("fa-minus")
        }
    })
}

function deleteBoard(boardId){
    const deleteBtn = htmlFactory(htmlTemplates.deleteBoard)
    domManager.addChild(`data-board-header-id: ${boardId}`,deleteBtn())



}
