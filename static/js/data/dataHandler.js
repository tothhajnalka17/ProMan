export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function (boardId) {
        return await apiGet(`/api/status/${boardId}`);
    },
    getStatus: async function (statusId) {

    },
    insertStatus: async function (name, boardId, columnOrder) {
        return await apiPost("/api/status/0",
            {"name":name, "boardId": boardId, "columnOrder": columnOrder})
    },
    updateStatusName: async function (columnId, newStatusName) {
        return await apiPut( `/api/status/${columnId}`, {"id": columnId, "name": newStatusName})
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}`);
    },
    getCard: async function (cardId) {
        return await apiGet(`/api/cards/${cardId}`);
    },
    createNewBoard: async function  (boardTitle) {
        return await apiPost('/api/boards/0', {"boardTitle": boardTitle})
    },
    updateBoardName: async function (boardId, newBoardName) {
        return await apiPut(`/api/boards/${boardId}`, {"boardId": boardId,
            "newBoardName": newBoardName})
    },
    createNewCard: async function (boardId, statusId, cardOrder) {
        return await apiPost("/api/cards/0",
            {"boardId": boardId,
                "statusId": statusId,
                "cardOrder": cardOrder})
    },
    updateCard: async function (id, boardId, statusId, title, cardOrder) {
        return await apiPost(`/api/cards/${id}/update`,
            {"statusId": statusId,
                "boardId": boardId,
                "title": title,
                "cardOrder": cardOrder})
    },
    deleteBoard: async function(boardId){
        return await apiDelete(`/api/boards/${boardId}`)
    },
    deleteColumn: async function(statusId){
        return await apiDelete(`/api/status/${statusId}`)
    },
    deleteCard: async function(trashId){
        return await apiDelete(`/api/cards/${trashId}/delete`)
    }
};

async function apiGet(url) {
    try {
        let response = await fetch(url, {
            method: "GET",
        });
        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error("An error has occurred in the get response!")
        }
    }
    catch (error) {
        console.log("An error has occurred!")
        console.log(error)
    }
}

async function apiPost(url, payload) {
    let data = new FormData()
    for (let [key, value] of Object.entries(payload)) {
        data.append(key, value)
    }
    try{
        let response = await fetch(url, {
            method: "POST",
            body: data
        })
        if (response.ok === false) {
            console.log("An error has occurred in the post response!");
        }
        return response
    }
    catch (error) {
        console.log("An error has occurred!")
        console.log(error)
    }
}

async function apiDelete(url) {
    try {
        let response = await fetch(url, {
            method: "DELETE"
        })
        if(response.ok === false){
            console.log("An error has occurred in the delete response!");
        }
    }
    catch (error){
        console.log("An error has occurred!")
        console.log(error)
    }
}

async function apiPut(url, payload) {
    let data = new FormData()
    for (let [key, value] of Object.entries(payload)) {
        data.append(key, value)
    }
    try{
        let response = await fetch(url, {
            method: "PUT",
            body: data
        })
        if (response.ok === false) {
            console.log("An error has occurred in the put response!");
        }
        return response
    }
    catch (error) {
        console.log("An error has occurred!")
        console.log(error)
    }
}

async function apiPatch(url) {
}
