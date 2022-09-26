// @ts-check

const { ipcRenderer } = require("electron");

let xdata = {
    decks: {
        A: {
            title: "",
            artist: "",
            isPlaying: false
        },
        B: {
            title: "",
            artist: "",
            isPlaying: false
        },
        C: {
            title: "",
            artist: "",
            isPlaying: false
        },
        D: {
            title: "",
            artist: "",
            isPlaying: false
        }
    }
}

ipcRenderer.send("__INIT__");

ipcRenderer.on("__DECK_EVENT__", (evt, args) => {

    // console.log("deckLoaded", args.data)

    const event = new CustomEvent("custom", {
        detail: args.data
    });
    document.dispatchEvent(event)
})

function handleChange(details) {
    // console.log("handle", details)

    let deckUpdate = JSON.parse(JSON.stringify(xdata.decks));
    deckUpdate[details.deck] = details;

    // console.log(deckUpdate)
    return deckUpdate
}
