document.addEventListener("DOMContentLoaded", () => {
    const letters = 5
    const guesses = 6
    const keys = document.querySelectorAll('.keyboard-row button')
    const toggle = document.getElementById("cbx")
    const dayIcon = document.getElementById("day")
    const nightIcon = document.getElementById("night")
    const themeSelector = document.getElementById("theme-select")
    const hideLetters = document.getElementById("hide-icon")
    let guessedWords = [[]]
    let availableSpace = 1
    let correctWord = "gnome"
    let guessedWordCount = 0
    let hardModeActivated = false
    createSquares(letters, guesses)
    createKeyboard()
    
    
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
        for (let i = 0; i < (letters*guesses); i++){
            let squareText = document.getElementById(String(i+1))
            if (squareText.textContent !== ""){
                squareText.textContent = ""
            }else{
                squareText.textContent = squareText.dataset.dataLetter
            }
        }

        for (let i = 0; i < keys.length; i++) {
            if (keys[i].dataset.bestColor !== "grey" && keys[i].style.backgroundColor !== "rgb(129, 131, 132)"){
                keys[i].style = "background-color: rgb(129, 131, 132);"
            } else {
                keys[i].style = `background-color: ${keys[i].dataset.bestColor};`
            }
        }
    }

   

    // set theme
    themeSelector.onclick = () => {
        //  if (window.getComputedStyle(dayIcon).display === "block") {
        //      dayIcon.style = "display:none;"
        //      nightIcon.style = "display:block;"
        //      document.getElementById("container").style = "background-color:white;"
        //      document.getElementById("wordle").style = "color: rgb(17, 17, 17);"
        //      document.getElementById("header").style = "border-bottom: 1px solid gainsboro"
          
        //      let modeLabels = document.getElementsByClassName("mode")
        //      for (let i = 0; i < modeLabels.length; i++) {
        //          modeLabels[i].style = "color: rgb(17, 17, 17);"
        //      }

        //      for (let i = 0; i < (letters*guesses); i++) {
        //         document.getElementById(String(i+1)).style = "border: 2px solid gainsboro; color: rgb(58, 58, 60);"
        //      }
        //      console.log(document.getElementById("4").style)

        //      for (let i = 0; i < (keys.length); i++) {
        //         keys[i].style = "color: rgb(17, 17,17); background-color: gainsboro;"
        //      }


        //      return
        //  }
        //  if (window.getComputedStyle(nightIcon).display === "block") {
        //      nightIcon.style = "display:none;"
        //      dayIcon.style = "display:block;"
        //      document.getElementById("container").style = "background-color:rgb(17, 17, 17); border: 1px solid rgb(17, 17, 17);"
        //      document.getElementById("wordle").style = "color: gainsboro;"
        //      document.getElementById("header").style = "border-bottom: 1px solid rgb(58, 58, 60), color: gainsboro;"

        //      let modeLabels = document.getElementsByClassName("mode")
        //      for (let i = 0; i < modeLabels.length; i++) {
        //          modeLabels[i].style = "color: gainsboro;"
        //      }

        //      for (let i = 0; i < (letters*guesses); i++) {
        //         document.getElementById(String(i+1)).style = "2px solid rgb(58, 58, 60); color: gainsboro;"
        //      }

        //      for (let i = 0; i < (keys.length); i++) {
        //         keys[i].style = "color: gainsboro; background-color: rgb(129, 131, 132);"
        //      }
        //      return
        //  }
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
            pickLetterAnimation(false)
            return
        }
        if (/^[a-z]$/.test(pressedLetter)){
            updateGuessedWords(pressedLetter)
            pickLetterAnimation(true)
        }
        
    })

    // logic accounts for double letter guess when only one instance exists in correct word
    function getTileColor(letter, index, copy, guessedWord) {
        const isLetterInWord = copy.includes(letter)
        const correctLetterAtIndex = copy.charAt(index)
        const guessedWordString = guessedWord.join('')
        
        if (!isLetterInWord){
            return ["rgb(58, 58, 60)", copy]
        } else if (correctLetterAtIndex === letter){
            return ["rgb(72, 138, 77)", copy]
        } else {
            return ["rgb(227, 196, 73)", copy]
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
        const guessedWord = getCurrentGuessedWord()

        // set color for squares
        currentWord.forEach((letter, index) => {
            setTimeout(() => {
                if (hardModeActivated){
                    squareColor = getTileColorHardMode(letter, index)
                }
                else{
                    result = getTileColor(letter, index, tileWordCopy, guessedWord)
                    squareColor = result[0]
                    tileWordCopy = result[1]
                }
                const currSquareID = firstSquareID + index
                const currSquare = document.getElementById(currSquareID)
                currSquare.classList.add("animate__rollIn")
                currSquare.style = `background-color:${squareColor}; border-color:${squareColor}` 

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
                result = getTileColor(currentWord[i], i, keyWordCopy, guessedWord)
                keyColor = result[0]
                keyWordCopy = result[1]
            }
            if (key.dataset.bestColor != "rgb(72, 138, 77)") {
                key.dataset.bestColor = keyColor
                key.style = `background-color:${keyColor}`
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