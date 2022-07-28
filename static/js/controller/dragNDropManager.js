export {initDragAndDrop}
import {dataHandler} from "../data/dataHandler.js";

const dom = {
    isEmpty: function (el) {
        return el.children.length === 0;
    }, hasClass: function (el, cls) {
        return el.classList.contains(cls);
    },
};

const ui = {
    columns: null, cards: null,
};

const card = {
    dragged: null,
};

function initDragAndDrop() {
    initElements();
    initDragEvents();
}

function initElements() {
    ui.cards = document.querySelectorAll(".card");
    ui.columns = document.querySelectorAll(".board-column");
        ui.cards.forEach(function (card) {
        card.setAttribute("draggable", true);
    });
}

function initDragEvents() {
    ui.cards.forEach(card => initDraggable(card));
    ui.columns.forEach(column => initDropzone(column));
}

function initDraggable(draggable) {
    draggable.setAttribute("draggable", true);
    draggable.addEventListener("dragstart", handleDragStart);
    draggable.addEventListener("dragend", handleDragEnd);
}

function initDropzone(dropzone) {
    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);
}

function handleDragStart(e) {
    card.dragged = e.currentTarget;
    card.dragged.classList.add('dragActive');
}

function handleDragEnd() {
    card.dragged.classList.remove('dragActive');
    card.dragged = null;
    }

function handleDragOver(e) {
    e.preventDefault();
    if (dom.hasClass(e.currentTarget, "mixed-cards")) {
        e.currentTarget.classList.add('cardContainerHover');
    }
}

function handleDragEnter(e) {
    if (dom.hasClass(e.currentTarget, "mixed-cards")) {
        e.currentTarget.classList.add('cardContainerHover');
    }
}

function handleDragLeave(e) {
    if (dom.hasClass(e.currentTarget, "ourColumn")) {
        e.currentTarget.classList.remove('cardContainerHover');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.currentTarget;
    // let boardId = document.querySelector(".board.row").getAttribute("data-board-id");
    // we may need this later if we can drag and drop cards from one board to another, and we want to stop that
    let cardId = card.dragged.getAttribute("data-card-id");
    let statusId = dropzone.getAttribute("data-column-id");
    let title = card.dragged.innerText;
    let cardOrder = document.querySelectorAll("dropzone>.board-column:nth-of-type(1)>.card").length + 1;
    dropzone.appendChild(card.dragged);
    dataHandler.updateCard(cardId, statusId, title, cardOrder);

    dropzone.classList.remove('cardContainerHover');
    return;
}