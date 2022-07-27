import {init} from "../main.js"

export let domManager = {
    addChild(parentIdentifier, childContent) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertAdjacentHTML("beforeend", childContent);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    addEventListener(parentIdentifier, eventType, eventHandler) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.addEventListener(eventType, eventHandler);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    clearRoot() {
        let rootDiv = document.querySelector("#root");
        Array.from(rootDiv.childNodes).forEach( child => child.remove() );
    },
    refreshPage () {
        // Need to remove event listeners of elements not located in root div
        let boardNameSubmitButton = document.querySelector("#boardNameSubmit");

        boardNameSubmitButton.replaceWith(boardNameSubmitButton.cloneNode(true));

        this.clearRoot();
        init();
    }
};
