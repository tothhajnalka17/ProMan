import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {displayColumns, columnsManager} from "./columnsManager.js";
import {initDragAndDrop} from "./dragNDropManager.js";
import {resetTitle} from "./util.js";

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
        let boardTitles = Array.from(document.querySelectorAll("h2.board-header"));
        boardTitles.forEach(boardTitle => {
            let oldTitle = boardTitle.innerText;
            if (boardTitle.hasClick === 'true'){
                return;
            }
                boardTitle.addEventListener("click", () => {
                    boardTitle.hasClick = "true";
                    if (boardTitle.hasFocusOutListener === 'true'){
                        return;
                    }

                    boardTitle.addEventListener("focusout", () => {
                        boardTitle.hasFocusOutListener = "true";
                        if (boardTitle.properSubmission !== "true") {
                            resetTitle(oldTitle, boardTitle);
                            }
                        boardTitle.properSubmission = "false";
                    })
                    boardTitle.addEventListener("keydown", async (event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            boardTitle.properSubmission = "true";
                            let boardId = event.target.dataset.headerId;
                            let newTitle = boardTitle.innerText;
                            oldTitle = newTitle;
                            try {
                                await dataHandler.updateBoardName(boardId, newTitle);
                            }
                            catch (error) {
                                console.log(`There was an error during the board name update: ${error}`);
                            }
                            finally {
                                event.target.blur();
                            }
                            }
                    })
                })
        })
    },
};

async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let statuses = await dataHandler.getStatuses(boardId);
    await displayColumns(boardId);
    await cardsManager.loadCards(boardId);

    cardsManager.insertAddCardButton(boardId, statuses[0]);

    // Call event related functions
    cardsManager.cardRenameControl();
    cardsManager.initDeleteCards()
    columnsManager.columnRenameControl();

    initDragAndDrop();

    let boardHeaderDiv = this.parentElement.parentElement;
    boardHeaderDiv.status = "open";
    let icon = clickEvent.target;
    icon.removeEventListener("click", showHideButtonHandler)
    icon.classList.remove("fa-chevron-down")
    icon.classList.add("fa-chevron-up")

    icon.addEventListener("click", event => {
        event.preventDefault();
        domManager.refreshPage();
    })
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
