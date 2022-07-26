import {boardsManager} from "./controller/boardsManager.js";
import {formManager} from "./controller/formManager.js";

export async function init() {
    boardsManager.loadBoards();
    formManager.initFormCreation();
}

init();
