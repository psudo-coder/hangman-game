// Game Words
word("sunshine", 5, "bright")
word("tower", 3, "tall")
word("kalimba", 4, "instrument")
word("hexagon", 5, "geometry")
word("wrestling", 6, "sport")
word("sombrero", 5, "hat")
word("unconscious", 6, "blackout")
word("watermelon", 6, "fruit")
word("calculator", 5, "math")
word("ancient", 4, "old")

// Game
saveGame(wordList)
renderGame()
startMessage()
if (game.status === "playing") {
    window.addEventListener("keydown", (e) => {
        document.querySelector("#title").innerHTML = "Hangman"
        game.makingGuess(e.key.toLowerCase())
        game.renderWord()
        game.gameStatus()
    })
} else {
    document.querySelector("#title").innerHTML = "Hangman"
}