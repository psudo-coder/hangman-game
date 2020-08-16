// Variables
let wordList = []
const abc = ["a", "b", "c",
    "d", "e", "f", "g", "h", "i",
    "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
]
const displayWord = document.querySelector("#word")
const displayMessage = document.querySelector("#message")
const displayGuesses = document.querySelector("#guesses")
const displayGuessesLeft = document.querySelector("#guessesLeft")
const displayTips = document.querySelector("#tips")
const tipButton = document.querySelector("a")
let game
let correctGuess = []
let tipUsed = []

// Hangman
class Hangman {
    constructor(word, guesses, tip) {
        this.word = word.split("")
        this.finalWord = ""
        this.guesses = guesses
        this.tip = tip
        this.guessedLetters = []
        this.status = "playing"
    }
    renderWord() {
        let newWord = ""
        let finalWord = ""
        this.word.forEach(letter => {
            if (this.guessedLetters.includes(letter) || letter === " ") {
                finalWord += letter
                newWord += `${letter} `
            } else {
                finalWord += "_"
                newWord += "_ "
            }
        })
        this.finalWord = finalWord
        displayWord.textContent = newWord
    }
    gameStatus() {
        if (this.guesses === 0) {
            displayMessage.textContent = `You've failed, the correct word was "${this.word.join("").toUpperCase()}"`
            this.status = "failed"
            this.newGame()
        } else if (this.word.join("") === this.finalWord) {
            displayMessage.textContent = `You've guessed the word! Contratulations!`
            guessedWords(this.word.join(""))
            this.status = "finished"
            this.newGame()
        } else {
            this.status = "playing"
        }
    }
    guessesLeft() {
        displayGuessesLeft.innerHTML = ""
        const p = document.createElement("p")
        if (this.guesses > 1) {
            p.textContent = `You have ${this.guesses} guesses left`
        } else {
            p.textContent = `You have ${this.guesses} guess left`
        }
        displayGuessesLeft.appendChild(p)
    }
    makingGuess(letter) {
        if (this.status !== "playing") {} else {
            if (typeof letter !== "string" || letter.length !== 1 || !abc.includes(letter)) {
                displayMessage.innerHTML = ""
                displayMessage.textContent = `Use a single letter for your guess`
            } else {
                displayMessage.innerHTML = ""
                if (!this.guessedLetters.includes(letter) && letter !== undefined) {
                    this.guessedLetters.push(letter)
                    const letterGuessed = document.createElement("span")
                    letterGuessed.textContent = `${letter.toUpperCase()}  `
                    displayGuesses.appendChild(letterGuessed)
                    if (!this.word.includes(letter) && this.guesses > 0) {
                        this.guesses--
                        this.guessesLeft()
                    }
                } else {
                    displayMessage.textContent = `The letter "${letter.toUpperCase()}" has already been used, please try another letter`
                }
            }
        }
    }
    newGame() {
        displayGuessesLeft.innerHTML = ""
        displayGuesses.innerHTML = ""
        const newDiv = document.createElement("div")
        newDiv.classList.add("blink", "blink-message")
        newDiv.textContent = `press the spacebar for the next game`
        displayGuesses.appendChild(newDiv)
        window.addEventListener("keydown", (e) => {
            if (e.code === "Space" && game.status !== "playing") {
                resetGame()
            }
        })
    }
}

// Word List Array
const word = (word, guesses, tip) => {
    wordList.push({
        word: word,
        guesses: guesses,
        tip: tip,
    })
}

const saveGame = function (list) {
    localStorage.setItem("game", JSON.stringify(list))
}

// Start Message
const startMessage = () => {
    const newDiv = document.createElement("div")
    newDiv.classList.add("blink")
    newDiv.textContent = `type your guess on the keyboard to start the game`
    displayMessage.appendChild(newDiv)
}

// Game
const getGame = function () {
    const gameJSON = localStorage.getItem("game")
    wordList = JSON.parse(gameJSON)
    if (wordList.length > 0) {
        const newGameObject = wordList[0]
        const newGame = new Hangman(newGameObject.word, newGameObject.guesses, newGameObject.tip)
        return newGame
    } else {
        gameOver()
    }
}

const renderGame = () => {
    tipDisplay()
    game = getGame()
    game.renderWord()
    game.guessesLeft()
}

const dumpOldWord = () => {
    wordList.shift()
    saveGame(wordList)
}

const resetGame = () => {
    displayWord.innerHTML = ""
    displayGuesses.innerHTML = ""
    displayGuessesLeft.innerHTML = ""
    displayMessage.innerHTML = ""
    dumpOldWord()
    tipDisplay()
    renderGame()
}

// Game Over
const finalMessage = (guessedWords, numberOfTips) => {
    let finalMessage = ""
    let messageOne = () => {
        let messageOne = ""
        if (guessedWords.length === 1) {
            messageOne = `You only guessed one word `
        } else {
            messageOne = `You guessed ${guessedWords.length} words `
        }
        return messageOne
    }
    let messageTwo = () => {
        let messageTwo = ""
        if (numberOfTips.length === 0) {
            messageTwo = `and you didn't use any tip!`
        } else if (numberOfTips.length === 1) {
            messageTwo = `and you only used the tip button once!`
        } else {
            messageTwo = `and you used the tip button ${numberOfTips.length} times!`
        }
        return messageTwo
    }
    if (guessedWords.length === 0) {
        finalMessage = `Too bad, you haven't guessed any of the words...`
    } else {
        finalMessage = messageOne() + messageTwo()
    }
    return finalMessage
}

const gameOver = () => {
    displayWord.innerHTML = ""
    displayWord.textContent = "G A M E  O V E R"
    displayGuesses.innerHTML = ""
    displayGuessesLeft.innerHTML = ""
    displayMessage.innerHTML = ""
    displayMessage.textContent = finalMessage(correctGuess, tipUsed)
    displayGuesses.textContent = "thanks for playing!"
    tipButton.style.display = "none";
    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            location.assign(`./index.html`)
        }
    })
}

// Counting valid unique tips
const repeatedTip = (tip) => {
    if (!tipUsed.includes(tip) && game.status === "playing") {
        tipUsed.push(tip)
    } else {
        displayMessage.textContent = "you already used your tip for this word"
    }
}

const tipCounter = () => {
    return 5 - tipUsed.length
}

const tipDisplay = () => {
    if (tipCounter() > 1) {
        tipButton.innerHTML = `${tipCounter()} &nbsp T I P S &nbsp L E F T`
    } else if (tipCounter() === 1) {
        tipButton.innerHTML = `${tipCounter()} &nbsp T I P &nbsp L E F T`
    } else {
        tipButton.innerHTML = `N O &nbsp T I P S &nbsp L E F T`
    }
}

// Counting valid and unique guesses
const guessedWords = (word) => {
    if (!correctGuess.includes(word)) {
        correctGuess.push(word)
    }
}

// Tip Button
tipButton.addEventListener("click", e => {
    if (tipCounter() > 0) {
        let newTip = ""
        game.tip.toUpperCase().split("").forEach(letter => {
            newTip += `${letter} `
        })
        repeatedTip(newTip)
        e.target.textContent = newTip
    }
})