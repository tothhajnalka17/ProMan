import {dataHandler} from "../data/dataHandler.js"
import {domManager} from "../view/domManager.js";

export let formManager = {
    initFormCreation: function () {
        document.querySelector("#boardNameSubmit").addEventListener("click", async event => {
            event.preventDefault();
            await dataHandler.createNewBoard(document.querySelector("#boardTitle").value)
            domManager.refreshPage();
        })
        document.querySelector("#boardRenameSubmit").addEventListener("click", async event => {
            event.preventDefault();
            await dataHandler.updateBoardName(document.querySelector("#boardId").value,
                document.querySelector("#newBoardName").value)
            domManager.refreshPage();
        })
}
}

