import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {initDropzone} from "./dragNDropManager.js";
import {resetTitle} from "./util.js";

export let columnsManager = {
    columnRenameControl: function() {
        // Clear column headers of event listeners as duplicate event listeners caused problems
        Array.from(document.querySelectorAll(".column-header")).forEach( node => {
        node.replaceWith(node.cloneNode(true));
        })

        let columnHeaderDivs = Array.from(document.querySelectorAll(".column-header"));
        columnHeaderDivs.forEach( columnHeaderDiv => {
            let oldTitle = columnHeaderDiv.innerText;
            if (columnHeaderDiv.hasClick === "true") {
                return;
            }
            columnHeaderDiv.addEventListener("click", () => {
                columnHeaderDiv.hasClick = "true";
                if (columnHeaderDiv.hasFocusOutListener === 'true'){
                    return;
                }
                columnHeaderDiv.addEventListener('focusout', () => {
                    columnHeaderDiv.hasFocusOutListener = 'true'
                    if (columnHeaderDiv.properSubmission !== 'true'){
                        resetTitle(oldTitle, columnHeaderDiv);
                    }
                    columnHeaderDiv.properSubmission = "false";
                })
                columnHeaderDiv.addEventListener("keydown", async (event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            columnHeaderDiv.properSubmission = "true"
                            let columnId = event.target.parentElement.dataset.columnId;
                            let newTitle = columnHeaderDiv.innerText;
                            oldTitle = newTitle;
                            try {
                                await dataHandler.updateStatusName(columnId, newTitle);
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
    insertAddColumnListener: function() {
    let addColumnButtons = Array.from(document.querySelectorAll(".add-column"))
    addColumnButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            let boardId = event.target.dataset.boardId;
            let statuses = await dataHandler.getStatuses(boardId);
            let newStatusOrder = statuses.length + 1;

            let response = await dataHandler.insertStatus("New Column", boardId, newStatusOrder);

            // if header is open:
            if (event.target.parentElement.parentElement.status === "open") {
                let status = await response.json();

                let parent = document.querySelector(`.board[data-board-id="${boardId}"]`);
                const columnBuilder = htmlFactory(htmlTemplates.column);
                let column = columnBuilder(status["title"], status["id"]);
                parent.appendChild(column);
                column.classList.add("ourColumn");
                await addDeleteColumnButton(parent, boardId);
                columnsManager.columnRenameControl();
                initDropzone(column);
            }
        })
    })
}
}

export async function displayColumns(boardId){
    const statuses = await dataHandler.getStatuses(boardId);
    let parent = document.querySelector(`.board[data-board-id="${boardId}"]`);
    const columnBuilder = htmlFactory(htmlTemplates.column);
    for (let status of statuses) {
        let column = columnBuilder(status.title, status.id);
        parent.appendChild(column);
        addDeleteColumnButton(parent, boardId);
    }
    let columns = Array.from(document.querySelectorAll(".board-column"))
    columns.forEach( column => {
        column.classList.add('ourColumn')
    })
}

async function addDeleteColumnButton(parent, boardId){
    const trash = document.createElement('i')
    trash.classList = "fa fa-trash inline bicon"
    trash.dataset.board_id = boardId
    trash.style = "float: right"
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


