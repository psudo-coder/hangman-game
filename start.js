const displayWord = document.querySelector("#word")
const displayMessage = document.querySelector("#start-message")
const displayGuesses = document.querySelector("#guesses")
const displayGuessesLeft = document.querySelector("#guess-message")
const displayTips = document.querySelector("#tips")


document.querySelector("#title").innerHTML = ""
const title = document.createElement("p")
title.textContent = `10 words mini-game`
displayGuessesLeft.appendChild(title)
const newDiv = document.createElement("div")
newDiv.classList.add("blink")
newDiv.textContent = `press the spacebar to start the game`
displayMessage.appendChild(newDiv)
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        location.assign(`./hangman.html`)
    }
})