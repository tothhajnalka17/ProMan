export const htmlTemplates = {
    board: 1,
    card: 2,
    renameForm: 3,
    column: 4,
    addBordForm: 5,
    deleteBoard: 6
    }

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.renameForm]: renameFormBuilder,
    [htmlTemplates.column]: columnBuilder,
    [htmlTemplates.addBordForm]: addBoardForm,
    [htmlTemplates.deleteBoard]: deleteBoard
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<div class="board-container">
                <div class="board-header-div" data-board-header-id="${board.id}">
                    <div class="inline">
                        <h2 class="board-header" data-header-id="${board.id}"> ${board.title} </h2>
                    </div>
                    <div class="inline right">
                        <i class="toggle-board-button fa fa-chevron-down" data-board-id="${board.id}"></i></i>
                    </div>               
                </div>
                <div class="board row" data-board-id=${board.id}>
                </div>    
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

function renameFormBuilder(oldName) {
    let element =
        `<form action="" method="get">
            <input type="text" name="newTitle" placeholder="${oldName}">
        </form>`
    return element
}

function columnBuilder(title, statusId) {
    let columnDiv = document.createElement("div");
    columnDiv.classList.add("board-column");
    columnDiv.setAttribute("data-column-id", statusId);
    let columnHeader = document.createElement("h4");
    columnHeader.innerText = title;
    columnDiv.appendChild(columnHeader);
    return columnDiv
}

function addBoardForm(){
    const newForm =

        `
       <i type="button" class="createBoardBtn fa fa-plus" id="createBoard" > New Board</i>
       
       <div id="form-container" class="boardFromDiv">
            <form action="/api/boards/create_board/" method="POST" id="boardNameForm">
                <input type="text" id="boardTitle" name="boardTitle" placeholder="New Board Name ">
                <i type="submit" id="boardNameSubmit" class="fa fa-check create"> Create </i>
            </form>
        </div>`
    return newForm
}

function deleteBoard(boardId){

    let deleteDiv = document.createElement("div")
    let deleteI = document.createElement("i")
    deleteDiv.classList.add("inline")
    deleteDiv.classList.add("trash")
    deleteI.classList.add("deleteBoardBtn")
    deleteI.classList.add("fa")
    deleteI.classList.add("fa-trash")
    deleteI.id = boardId

    deleteDiv.appendChild(deleteI)

    return deleteDiv

}

