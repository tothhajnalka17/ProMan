import {boardsManager} from "./controller/boardsManager.js";
import {formManager} from "./controller/formManager.js";
import {columnsManager} from "./controller/columnsManager.js";

export async function init() {
    await boardsManager.loadBoards();
    formManager.initFormCreation();
    columnsManager.insertAddColumnListener();
    boardsManager.boardRenameControl();
}

init();
