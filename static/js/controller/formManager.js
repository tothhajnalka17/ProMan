import {dataHandler} from "../data/dataHandler.js";
import {domManager} from "../view/domManager.js";

async function submitForm() {
    let boardTitle = "New Board";
    if (document.querySelector("#boardTitle").value !== "") {
        boardTitle = document.querySelector("#boardTitle").value;
    }

    let userId = 0;
    if (document.querySelector("#privateBox") !== null && document.querySelector("#privateBox").checked) {
        userId = localStorage.getItem("userId");
    }

    await dataHandler.createNewBoard(boardTitle, userId);
    domManager.refreshPage();
}

export let formManager = {
    initFormCreation: function () {
        document.querySelector("#boardNameForm").addEventListener("submit", (event) => {
            event.preventDefault();
        })
        document.querySelector('#boardTitle').addEventListener('keydown', async (event) => {
            if (event.key === "enter") {
                await submitForm();
            }
        })

        document.querySelector("#boardNameSubmit").addEventListener("click", async event => {
            event.preventDefault();
            await submitForm();
        })
}
}

