import {dataHandler} from "../data/dataHandler";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory";

export async function add_columns(boardId){
    const statuses = await dataHandler.getStatuses(boardId);
    let parent = document.querySelector(`.board[data-board-id="${boardId}"]`);
    const columnBuilder = htmlFactory(htmlTemplates.column);
    for (let status of statuses) {
        let column = columnBuilder(status.title);
        parent.appendChild(column);
    }
}
