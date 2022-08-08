import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";

export let columnsManager = {
    columnRenameControl: function() {
        // Clear column headers of event listeners as duplicate event listeners caused problems
        Array.from(document.querySelectorAll(".column-header")).forEach( node => {
        node.replaceWith(node.cloneNode(true));
        })

        let columnHeaderDivs = Array.from(document.querySelectorAll(".column-header"));
        columnHeaderDivs.forEach( columnHeaderDiv => {
            columnHeaderDiv.addEventListener("click", () => {
                renameColumnHandler(columnHeaderDiv);
            })
        })
    },
    insertAddColumnListener: function() {
    let addColumnButtons = Array.from(document.querySelectorAll(".add-column"))
    addColumnButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            let boardId = event.target.dataset.boardId;
            let statuses = await dataHandler.getStatuses(boardId);
            let newStatusOrder = statuses.length + 1;

            let status = await dataHandler.insertStatus("New Column", boardId, newStatusOrder);

            let parent = document.querySelector(`.board[data-board-id="${boardId}"]`);
            const columnBuilder = htmlFactory(htmlTemplates.column);
            let column = columnBuilder(status["title"], status["id"]);
            parent.appendChild(column);
            column.classList.add("ourColumn");
        })
    })
}
}

export async function add_columns(boardId){
    const statuses = await dataHandler.getStatuses(boardId);
    let parent = document.querySelector(`.board[data-board-id="${boardId}"]`);
    const columnBuilder = htmlFactory(htmlTemplates.column);
    for (let status of statuses) {
        let column = columnBuilder(status.title, status.id);
        parent.appendChild(column);
        deleteColumn(parent, boardId)
    }
    let columns = Array.from(document.querySelectorAll(".board-column"))
    columns.forEach( column => {
        column.classList.add('ourColumn')
    })
}

export function renameColumnHandler(headerDiv) {
    let statusName = headerDiv.innerText;
    let statusId = headerDiv.parentElement.getAttribute("data-column-id");

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
        } catch (error) {
            console.log(`There was an error during the board name update: ${error}`);
        }
    });
}

async function deleteColumn(parent, boardId){
    const trash = document.createElement('i')
    trash.classList = "fa fa-trash inline bicon"
    trash.dataset.board_id = boardId
    trash.style = "float: right"
    console.log(parent.dataset.boardId)
    let columns = parent.children
    if (parent.dataset.boardId === boardId) {

        for(let i=0;i<columns.length;i++) {
            const column = columns[i]
            trash.dataset.delId = column.dataset.columnId
            column.insertBefore(trash, column.firstChild)
        }
    trash.addEventListener("click", async e => {
        await dataHandler.deleteColumn(trash.dataset.delId);
        e.target.parentElement.remove();
        })
    }
}


