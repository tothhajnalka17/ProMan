import {boardsManager} from "./controller/boardsManager.js";
import {formManager} from "./controller/formManager.js";

function init() {
    boardsManager.loadBoards();
    formManager.initFormCreation();
}

init();
