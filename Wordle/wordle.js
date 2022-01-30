document.addEventListener("DOMContentLoaded", () => {
    const letters = 5
    const guesses = 6
    const keys = document.querySelectorAll('.keyboard-row button')
    const toggle = document.getElementById("cbx")
    let guessedWords = [[]]
    let availableSpace = 1
    let correctWord = "bully"
    let guessedWordCount = 0
    let hardModeActivated = false
    createSquares(letters, guesses)
    createKeyboard()

    // toggle hard mode on and off
    toggle.onclick = () => {
        if (toggle.checked){
            hardModeActivated = true
        }else {
            hardModeActivated = false
        }
        console.log(hardModeActivated)
    }

    // ensures board looks decent on all devices.
    window.addEventListener("resize", () =>{
        const gameboard = document.getElementById("board")
        const height = window.screen.availHeight - 250;
        gameboard.style = `width: ${(.83*height)}px; height: 100%;`
    })


    // This will allow user to use phiscal keyboard as well as one in game
    window.addEventListener("keydown", (e) =>{
        const pressedLetter = e.key.toLowerCase()
        if (pressedLetter === 'enter'){
            validateCurrWord()
            return
        }
        if (pressedLetter === 'backspace'){
            removeLetter()
            return
        }
        if (/^[a-z]$/.test(pressedLetter)){
            updateGuessedWords(pressedLetter)
        }
        
    })


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

    function getTileColorHardMode(letter, index) {
        const isCorrectLetter = correctWord.includes(letter)
        const letterAtPostion = correctWord.charAt(index)

        if (!isCorrectLetter){
            return "rgb(194, 58, 58)"
        }else{
            return "rgb(58, 58, 60)"
        }
    }

    function setCorrectColors(currentWord){
        const firstSquareID = letters * guessedWordCount + 1
        const interval = 200
        let squareColor = ''
        let keyColor = ''

        // set color for squares
        currentWord.forEach((letter, index) => {
            setTimeout(() => {
                if (hardModeActivated){
                    console.log(letter + squareColor)
                }
                else{
                    squareColor = getTileColor(letter, index)
                }
                const currSquareID = firstSquareID + index
                const currSquare = document.getElementById(currSquareID)
                currSquare.classList.add("animate__rollIn")
                currSquare.style = `background-color:${squareColor}; border-color:${squareColor}` 

            }, interval * index)
        })
        guessedWordCount += 1

        // set color for keyboard keys
        for (let i = 0; i < currentWord.length; i++){
            const key = document.getElementById(currentWord[i])
            if (hardModeActivated){
                keyColor = getTileColorHardMode(currentWord[i], i)
            }
            else{
                keyColor = getTileColor(currentWord[i], i)
            }
            key.style = `background-color:${keyColor}`
        }
    }

    function validateCurrWord(){
        currWord = getCurrentGuessedWord()
        const currWordString = currWord.join('')
        
        if (currWord.length !== letters){
            window.alert(`Word must be ${letters} letters`)
            return
        } 

        if (currWordString === correctWord){
            setCorrectColors(currWord)
            window.alert("You did it! I knew you had it in you...")
        }
        else if (guessedWords.length === guesses) {
            setCorrectColors(currWord)
            window.alert(`So close, the word was ${correctWord}! Maybe next time...`)
        }
        else {
            setCorrectColors(currWord)
            guessedWords.push([])
        }
    }

    function createSquares(letters, guesses){
        let squareID = 1
        const gameboard = document.getElementById("board")
        const height = window.screen.availHeight - 250;
        gameboard.style = `width: ${(.83*height)}px; height: 100%;`

        for (let i = 0; i < guesses; i ++){
            const row = document.createElement("div")
            row.classList.add("game-row")
            for( let j = 0; j < letters; j++){
                let square = document.createElement("div")
                square.classList.add("square") 
                square.classList.add("animate__animated") 
                square.setAttribute("id", squareID)
                row.appendChild(square)
                squareID++
            }
            gameboard.appendChild(row)
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