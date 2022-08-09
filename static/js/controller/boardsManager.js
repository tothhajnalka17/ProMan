import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {add_columns, columnsManager} from "./columnsManager.js";
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
            deleteBoardHandler(board.id)
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
};


async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let statuses = await dataHandler.getStatuses(boardId);
    await add_columns(boardId);
    await cardsManager.loadCards(boardId);

    cardsManager.insertAddCardButton(boardId, statuses[0]);

    // Call event related functions
    cardsManager.cardRenameControl();
    cardsManager.deleteCrd()
    columnsManager.columnRenameControl();

    initDragAndDrop();

    let icon = clickEvent.target;
    icon.removeEventListener("click", showHideButtonHandler)
    icon.classList.remove("fa-chevron-down")
    icon.classList.add("fa-chevron-up")

    icon.addEventListener("click", event => {
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

function addNewBoardForm(){
    const NewForm = htmlFactory(htmlTemplates.addBordForm)
    domManager.addChild("#root", NewForm())
    const createBtn = document.getElementById("createBoard")
    const formDiv = document.getElementById("form-container")
    createBtn.addEventListener("click", ev => {
        if(formDiv.style.display === 'block'){
            formDiv.style.display = 'none';
            createBtn.classList.remove("fa-minus");
            createBtn.classList.add("fa-plus");
        }else{
          formDiv.style.display = 'block';
          createBtn.classList.remove("fa-plus");
          createBtn.classList.add("fa-minus");
          extendBoardForm();
        }
    })
}

function extendBoardForm() {
    let form = document.querySelector("#boardNameForm");
    if (localStorage.getItem("username") !== null && document.querySelector("#privateBox") === null) {
        let boxDiv = document.createElement("div");
        let checkBox = document.createElement("input");
        let label = document.createElement("label");

        label.for = "private";
        label.innerText = "Private";

        checkBox.type = "checkbox";
        checkBox.id = "privateBox";
        checkBox.name = "privateBox";

        boxDiv.appendChild(checkBox);
        boxDiv.appendChild(label);
        form.appendChild(boxDiv);
    }
}

function deleteBoardHandler(boardId){
    const content = htmlFactory(htmlTemplates.deleteBoard)
    const header = document.querySelector(`[data-board-header-id="${boardId}"]`)
    header.appendChild(content(boardId))
    const deleteBtn = document.getElementById(boardId)
    deleteBtn.addEventListener("click", async (e) =>{
        await dataHandler.deleteBoard(boardId)
        e.target.parentElement.parentElement.parentElement.remove()
    })
}
