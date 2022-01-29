document.addEventListener("DOMContentLoaded", () => {
    const letters = 5
    const guesses = 6
    const keys = document.querySelectorAll('.keyboard-row button')
    let guessedWords = [[]]
    let availableSpace = 1
    let correctWord = "bully"
    let guessedWordCount = 0
    createSquares(letters, guesses)
    createKeyboard()

    function getTileColor(letter, index) {
        const isCorrectLetter = correctWord.includes(letter)
        const letterAtPostion = correctWord.charAt(index)

        if (!isCorrectLetter){
            return "rgb(58, 58, 60)"
        }
        if (letterAtPostion === letter){
            return "rgb(72, 138, 77)"
        }else{
            return "rgb(177, 191, 86)"
        }
    }

    function validateCurrWord(){
        currWord = getCurrentGuessedWord()
        const currWordString = currWord.join('')
        const firstSquareID = letters * guessedWordCount + 1
        const interval = 200

        
        if (currWord.length !== letters){
            window.alert(`Word must be ${letters} letters`)
            return
        } 
        currWord.forEach((letter, index) => {
            setTimeout(() => {
                const squareColor = getTileColor(letter, index)
                const currSquareID = firstSquareID + index
                const currSquare = document.getElementById(currSquareID)
                currSquare.classList.add("animate__rollIn")
                currSquare.style = `background-color:${squareColor}; border-color:${squareColor}` 
            }, interval * index)
        })
        guessedWordCount += 1

        if (currWordString === correctWord){
            window.alert("You did it! I knew you had it in you...")
        }
        else if (guessedWords.length === guesses) {
            window.alert(`So close, the word was ${correctWord}! Maybe next time...`)
        }
        else {
            guessedWords.push([])
        }
    }

    function createSquares(letters, guesses){
        
        const gameboard = document.getElementById("board")

        for (let i = 0; i < (letters*guesses); i ++){
            let square = document.createElement("div")
            square.classList.add("square") 
            square.classList.add("animate__animated") 
            square.setAttribute("id", i + 1)
            gameboard.appendChild(square)
        }
    }

    function removeLetter(){
        const spaceToRemoveFrom = document.getElementById(String(availableSpace - 1))
        const currWord = getCurrentGuessedWord()

        if (currWord.length === 0){
            window.alert("There are no letters from this guess to delete.")
            return
        }
        spaceToRemoveFrom.textContent = ''
        availableSpace = availableSpace - 1
        currWord.pop()
    }
    
    function createKeyboard(){
        for (let i = 0; i < keys.length; i++) {
            keys[i].onclick = ({ target }) => {
                const key = target.getAttribute("data-key")
                
                if (key === 'enter'){
                    validateCurrWord()
                    return
                }
                if (key === 'del'){
                    removeLetter()
                    return
                }
                updateGuessedWords(key)
            }
        }
    
    }

    function updateGuessedWords(letter){
        const currWord = getCurrentGuessedWord()

        if (currWord && currWord.length < letters) {
            currWord.push(letter)

            currAvailableSpace = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1 

            currAvailableSpace.textContent = letter
        }

    }

    function getCurrentGuessedWord() {
        const numberOfGuessedWords = guessedWords.length
        return guessedWords[numberOfGuessedWords - 1]
    }
})