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
    updateStatusName: async function (columnId, newStatusName) {
        return await apiPost("/api/status/update_status_name/", {"id": columnId, "name": newStatusName})
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        return await apiGet(`/api/cards/${cardId}`);
    },
    createNewBoard: async function (boardTitle) {
        return await apiPost('/api/boards/create_board/', {"boardTitle": boardTitle})
    },
    updateBoardName: async function (boardId, newBoardName) {
        return await apiPost('/api/boards/update_board_name/', {"boardId": boardId,
            "newBoardName": newBoardName})
    },
    createNewCard: async function (boardId, statusId, cardOrder) {
        return await apiPost("api/cards/insert",
            {"boardId": boardId,
                "statusId": statusId,
                "cardOrder": cardOrder})
    },
    updateCard: async function (id, statusId, title, cardOrder) {
        return await apiPost(`/api/cards/${id}/update`,
            {"statusId": statusId,
                "title": title,
                "cardOrder": cardOrder})
    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
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
            console.log("An error has occurred in the response!");
        }
        return response
    }
    catch (error) {
        console.log("An error has occurred!")
        console.log(error)
    }
}

async function apiDelete(url) {
}

async function apiPut(url) {
}

async function apiPatch(url) {
}
