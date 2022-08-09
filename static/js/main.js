import {boardsManager} from "./controller/boardsManager.js";
import {formManager} from "./controller/formManager.js";
import {columnsManager} from "./controller/columnsManager.js";

export async function init() {
    await boardsManager.loadBoards();
    formManager.initFormCreation();
    columnsManager.insertAddColumnListener();
    console.log(localStorage.getItem("username"), localStorage.getItem("user_id"));
}

init();
