document.addEventListener("DOMContentLoaded", () => {
    const letters = 5
    const guesses = 6
    const keys = document.querySelectorAll('.keyboard-row button')
    const toggle = document.getElementById("cbx")
    // const dayIcon = document.getElementById("day")
    // const nightIcon = document.getElementById("night")
    // const themeSelector = document.getElementById("theme-select")
    const hideLetters = document.getElementById("hide-icon")
    const responseModal = document.getElementById("response-modal")
    let guessedWords = [[]]
    let availableSpace = 1
    let guessedWordCount = 0
    let hardModeActivated = false
    let wordList = ['treat', 'sleep', 'nasty', 'ready', 'quest', 'exist', 'crate', 'macho', 'obese', 'abide', 'jeans',
    'count', 'month', 'kneel', 'scare', 'shave', 'train', 'boast', 'solve', 'scent', 'paste', 'offer', 'sound', 'first',
    'heave', 'violet', 'stone', 'front', 'start', 'dwell', 'fruit', 'savor', 'fling', 'argue', 'force', 'ferry', 'bored',
    'chore', 'nurse', 'press', 'hurry', 'milky', 'shade', 'cabin', 'eager', 'cable', 'fungi', 'quill', 'utter', 'cabob',
    'often', 'label', 'lymph', 'pacer', 'armor', 'visor', 'yodel', 'smoke', 'pride', 'wield', 'ghost', 'laker', 'brain', 
    'yikes', 'swell', 'brake', 'wreck', 'watch', 'index', 'gross', 'plant', 'coach', 'straw', 'grape', 'snake', 'grade',
    'under', 'outer', 'crawl', 'nudge', 'power', 'grass', 'order', 'swipe', 'mango', 'trash', 'clean', 'llama', 'squat', 
    'water', 'swing', 'trade', 'story', 'quail', 'paste', 'brave', 'hinge', 'brang', 'white', 'zesty', 'viral', 'saber',
    'there', 'snort', 'slate', 'chart', 'moral', 'spoke', 'break', 'xerox', 'heave', 'organ', 'wrote', 'green', 'shrug',
    'their', 'axial', 'bagel', 'charm', 'cough', 'dried', 'eject', 'funky', 'giant', 'glint', 'honey', 'infer', 'kayak']

    // new word each day of the year
    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const currDateTime = new Date()
    const month = currDateTime.getMonth()
    let dayNum = 0
    for (let i = 0; i < month; i++){
        dayNum += monthLengths[i]
    }
    dayNum += currDateTime.getDate()
    const correctWord = wordList[dayNum]

    
    createSquares(letters, guesses)
    createKeyboard()
    initLocalStorage()
    loadGameState()

    
    // use local storage
    function initLocalStorage() {
        const storedCorrectWord = window.localStorage.getItem("correctWord")
        if (!storedCorrectWord){
            window.localStorage.setItem("correctWord", correctWord)
        }
        
    }

    // pick new word every 24 hours
    


    // reload game if in progress, reset if new word
    function loadGameState() {
        
        const storedBoardState = window.localStorage.getItem("boardState")
        const storedkeyState = window.localStorage.getItem("keyState")
        const storedAvailableSpace = window.localStorage.getItem("availableSpace") || 1
        const storedGuessedWords = JSON.parse(window.localStorage.getItem("guessedWords")) || [[]]
        const storedGuessedWordCount = window.localStorage.getItem("guessedWordCount") || 0
        const storedCorrectWord = window.localStorage.getItem("correctWord")
        const storedHardMode = window.localStorage.getItem("hardMode") || false
        const storedWordIndex = Number(window.localStorage.getItem("wordIndex")) || 0
    

        if (storedCorrectWord === correctWord){
            if (storedBoardState){
                document.getElementById("board-container").innerHTML = storedBoardState
            }
            if (storedkeyState){
                document.getElementById("keyboard-container").innerHTML = storedkeyState
                createKeyboard()
            }
            availableSpace = Number(storedAvailableSpace)
            guessedWords = storedGuessedWords
            guessedWordCount = Number(storedGuessedWordCount)
            hardModeActivated = getBooleanValue(storedHardMode)
            wordIndex = Number(storedWordIndex)
    
        } else {
            window.localStorage.setItem("correctWord", correctWord)

            window.localStorage.removeItem("guessedWords")
            window.localStorage.removeItem("availableSpace")
            window.localStorage.removeItem("guessedWordCount")
            window.localStorage.removeItem("hardMode")
            window.localStorage.removeItem("boardState")
            window.localStorage.removeItem("keyState")
        }

    }

    // used to save progress of game 
    function saveGameState(){
        const boardState = document.getElementById("board-container")
        const keyState = document.getElementById("keyboard-container")
        window.localStorage.setItem("boardState", boardState.innerHTML)
        window.localStorage.setItem("keyState", keyState.innerHTML)
        window.localStorage.setItem("availableSpace", availableSpace) 
        window.localStorage.setItem("guessedWords", JSON.stringify(guessedWords))
        window.localStorage.setItem("guessedWordCount", guessedWordCount)
        window.localStorage.setItem("hardMode", hardModeActivated)
        // window.localStorage.setItem("wordIndex", wordIndex)
    }


    function getBooleanValue(bool){
        if (bool === "true"){
            return true
        }else {
            return false
        }
    }
    
    // toggle hard mode on and off
    toggle.onclick = () => {
        if (guessedWordCount === 0){
            if (toggle.checked){
                hardModeActivated = true
                
            }else {
                hardModeActivated = false
                
            }
        }else {
            if (toggle.checked){
                toggle.checked = false
            } else {
                toggle.checked = true
            }
            window.alert("Sorry! You can't switch modes mid-game.")
        }
    }

    // hide letters  and key colors so user can screenshot and share results
    hideLetters.onclick = () => {
        let drawLetters = false
        for (let i = 0; i < (letters*guesses); i++){
            let squareText = document.getElementById(String(i+1))
            if (squareText.textContent !== ""){
                squareText.textContent = ""
            }else{
                squareText.textContent = squareText.dataset.dataLetter
                drawLetters = true
            }
        }

        const keys = document.querySelectorAll('.keyboard-row button')
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].dataset.bestColor !== "grey" && keys[i].style.backgroundColor !== "rgb(129, 131, 132)"){
                keys[i].style = "background-color: rgb(129, 131, 132);"
            } else {
                keys[i].style = `background-color: ${keys[i].dataset.bestColor};`
            }
        }
    }

   

    // set theme
    // themeSelector.onclick = () => {
        
    // }   
  

    // ensures board looks decent on all devices.
    window.addEventListener("resize", () =>{
        const gameboard = document.getElementById("board")
        const height = window.screen.availHeight - 250;
        gameboard.style = `width: ${(.83*height)}px; height: 100%;`
    })


    // This will allow user to use physical keyboard as well as one in game
    window.addEventListener("keydown", (e) =>{
        const pressedLetter = e.key.toLowerCase()
        if (pressedLetter === 'enter'){
            validateCurrWord()
            return
        }
        if (pressedLetter === 'backspace'){
            removeLetter()
            pickLetterAnimation(false)
            return
        }
        if (/^[a-z]$/.test(pressedLetter)){
            updateGuessedWords(pressedLetter)
            pickLetterAnimation(true)
        }
        
    })

    // logic accounts for double letter guess when only one instance exists in correct word
    function getNonGreenTileColor(letter, index, copy) {
        const isLetterInWord = copy.includes(letter)
        const indexOfLetterInCorrectWord = copy.indexOf(letter)
        
        if (!isLetterInWord){
            return ["rgb(58, 58, 60)", copy]
        } else {
            copy = setCharAt(copy, indexOfLetterInCorrectWord, ".")
            return ["rgb(201, 180, 88)", copy]
        }
    }

    // similar to replace() function but takes index
    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }

    // first pass will only color correct tiles green
    function getGreenTiles(letter, index, copy) {
        const correctLetterAtIndex = copy.charAt(index)

        if (correctLetterAtIndex === letter){
            copy = setCharAt(copy, index, ".")
            return ["rgb(72, 138, 77)", copy]
        } else {
            return ["rgb(58, 58, 60)", copy]
        }
    }

    function getTileColorHardMode(letter, index) {
        const isCorrectLetter = correctWord.includes(letter)

        if (!isCorrectLetter){
            return "rgb(194, 58, 58)"
        }else{
            return "rgb(129, 131, 132);"
        }
    }

    function setCorrectColors(currentWord){
        const firstSquareID = letters * guessedWordCount + 1
        const interval = 300
        let squareColor = ''
        let keyColor = ''
        let tileWordCopy = correctWord
        let keyWordCopy = correctWord
        let colorMap = new Map()
        const guessedWord = getCurrentGuessedWord()

        // first pass to get green colors
        currentWord.forEach((letter, index) =>{
            let firstPass = getGreenTiles(letter, index, tileWordCopy)
            if (firstPass[0] === "rgb(72, 138, 77)"){
                colorMap.set(index, firstPass[0])
                tileWordCopy = firstPass[1]
            }
        })

        let copyForSecondPass = tileWordCopy
        // second pass to get remaining colors
        currentWord.forEach((letter, index) =>{
            if (tileWordCopy[index] !== "."){
                let secondPass = getNonGreenTileColor(letter, index, copyForSecondPass)
                colorMap.set(index, secondPass[0])
                copyForSecondPass = secondPass[1] 
            }
        })
    
        // third pass to set and animate the colors and squares
        currentWord.forEach((letter, index) => {
            setTimeout(() => {
                if (hardModeActivated){
                    squareColor = getTileColorHardMode(letter, index)
                }
                else{
                    squareColor = colorMap.get(index)
                }
                const currSquareID = firstSquareID + index
                const currSquare = document.getElementById(currSquareID)
                currSquare.classList.add("animate__rollIn")
                currSquare.style = `background-color:${squareColor}; border-color:${squareColor}` 

                if (index === (letters-1)){
                    saveGameState()
                }

            }, interval * (index))
        })

        guessedWordCount += 1

        // set color for keyboard keys
        for (let i = 0; i < currentWord.length; i++){
            const key = document.getElementById(currentWord[i])
            if (hardModeActivated){
                keyColor = getTileColorHardMode(currentWord[i], i)
            }
            else{
                keyColor = colorMap.get(i)
            }
            if (key.dataset.bestColor != "rgb(72, 138, 77)") {
                key.dataset.bestColor = keyColor
                key.style = `background-color:${keyColor}`
            }
            if (i === (letters-1)){
                saveGameState()
            }
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
            setTimeout(() => {
                responseModal.style = "display:block;"
                responseModal.innerHTML = "You did it! I knew you had it in you..."
            }, (310 * letters))
            setTimeout(() => {
                responseModal.style = "display:none;"
                responseModal.innerHTML = ""
            }, 4000)
            
        }
        else if (guessedWords.length === guesses) {
            setCorrectColors(currWord)
            setTimeout(() => {
                responseModal.style = "display:block;"
                responseModal.innerHTML = `So close, the word was ${correctWord}! Maybe next time...`
            }, (310 * letters))
            setTimeout(() => {
                responseModal.style = "display:none;"
                responseModal.innerHTML = ""
            }, 4000)
        }
        else {
            guessedWords.push([])
            setCorrectColors(currWord)
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
                square.setAttribute("data-letter", "")
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

    // set animation for current square if letter typed, and previous if DEL typed.
    function pickLetterAnimation(bool){
        const currSquare = document.getElementById(String(availableSpace -1))
        const prevSquare = document.getElementById(String(availableSpace))
        if (bool){
            currSquare.style = "border-color: #666; animation-name:press; animation-duration:100ms;"
        }else
            prevSquare.style = "border-color: rgb(58, 58, 60);"
    }
    
    function createKeyboard(){
        const keys = document.querySelectorAll('.keyboard-row button')
        for (let i = 0; i < keys.length; i++) {
            keys[i].onclick = ({ target }) => {
                const key = target.getAttribute("data-key")
                
                if (key === 'enter'){
                    validateCurrWord()
                    return
                }
                if (key === 'del'){
                    removeLetter()
                    pickLetterAnimation(false)
                    return
                }
                updateGuessedWords(key)
                pickLetterAnimation(true)
            }
        }
    
    }

    function updateGuessedWords(letter){
        const currWord = getCurrentGuessedWord()

        if (currWord && currWord.length < letters) {
            currWord.push(letter)

            currAvailableSpace = document.getElementById(String(availableSpace))
            currAvailableSpace.textContent = letter
            currAvailableSpace.dataset.dataLetter = String(letter)
            availableSpace = availableSpace + 1 
        }

    }

    function getCurrentGuessedWord() {
        const numberOfGuessedWords = guessedWords.length 
        return guessedWords[numberOfGuessedWords - 1]
    }

})