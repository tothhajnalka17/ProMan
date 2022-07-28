import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";

export let columnsManager = {
    columnRenameControl: function() {
        let columnHeaderDivs = Array.from(document.querySelectorAll(".column-header"));
        columnHeaderDivs.forEach( columnHeaderDiv => {
            columnHeaderDiv.addEventListener("click", () => {
                renameColumnHandler(columnHeaderDiv);
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
    }
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