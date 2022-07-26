import {dataHandler} from "../data/dataHandler.js"

export let formManager = {
    initBoardCreation: function () {
        document.querySelector("#boardNameSubmit").addEventListener("click", event => {
            event.preventDefault();
            dataHandler.createNewBoard(document.querySelector("#boardTitle").value)
        })
        document.querySelector("#boardRenameSubmit").addEventListener("click", event => {
            event.preventDefault();
            dataHandler.updateBoardName(document.querySelector("#boardId").value,
                document.querySelector("#newBoardName").value)
        })
}
}

