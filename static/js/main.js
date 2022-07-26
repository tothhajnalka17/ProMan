import {boardsManager} from "./controller/boardsManager.js";
import {formManager} from "./controller/formManager.js";

export async function init() {
    await boardsManager.loadBoards();
    formManager.initFormCreation();
    boardsManager.boardRenameControl();
}

init();
