// @ts-check

const { app, BrowserWindow, ipcMain } = require("electron")
const express = require("express");
const bodyparser = require("body-parser");


/** @type Electron.webContents */
let clientRenderer;

ipcMain.on("__INIT__", (evt) => {
    console.log("received __INIT__")
    clientRenderer = evt.sender;
});


let deckA = {
    // elapsedTime: propElapsedTime.value,
    deck: "A",
    isPlaying: false,
    title: "song title",
    artist: "artist",
    date: new Date()
};
let deckB = {
    // elapsedTime: propElapsedTime.value,
    deck: "B",
    isPlaying: false,
    title: "song title B",
    artist: "artist B",
    date: new Date()
};

setInterval(() => {
    deckA.isPlaying = !deckA.isPlaying;
    clientRenderer && clientRenderer.send("__DECK_EVENT__", { data: deckA })
}, 5000)

setInterval(() => {
    deckB.isPlaying = !deckB.isPlaying;
    clientRenderer && clientRenderer.send("__DECK_EVENT__", { data: deckB })
}, 6000)

const server = express();

server.use(bodyparser.urlencoded({ extended: false }))
server.use(bodyparser.json())

server.post("/deckLoaded", (req, res) => {
    console.log("/deckLoaded");
    console.log(req.body);

    clientRenderer.send("__DECK_EVENT__", { data: req.body })
    res.end();
})

// server.post("/updateDeck", (req, res) => {
//     console.log("updateDeck")
//     console.log(req.body)
//     res.end();
// })

// server.post("/updateChannel", (req, res) => {
//     console.log("updateChannel")
//     console.log(req.body)
//     res.end();
// })
// server.post("/updateMasterClock", (req, res) => {
//     console.log("updateMasterClock")
//     console.log(req.body)
//     res.end();
// })

server.listen(8081, () => {
    console.log("listening 8081")
})


function createWindow() {
    let debug = true

    let mainWindow = new BrowserWindow({
        width: debug ? 1200 : 600,
        height: debug ? 700 : 400,
        frame: debug,
        transparent: !debug,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadFile("src/front/index.html")
    debug && mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit()
})
