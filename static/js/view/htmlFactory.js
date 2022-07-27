export const htmlTemplates = {
    board: 1,
    card: 2,
    renameForm: 3
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.renameForm]: renameFormBuilder,
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
                <div class="board-header-div">
                    <div class="inline">
                        <h2 class="board-header" data-header-id="${board.id}"> ${board.title} </h2>
                    </div>
                    <div class="inline right">
                        <button class="toggle-board-button" data-board-id="${board.id}"></button>
                    </div>               
                </div>
                <div class="board row" data-board-id=${board.id}>
                    <div class="board-column"></div>
                    <div class="board-column"></div>
                    <div class="board-column"></div>
                    <div class="board-column"></div>
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
