import { guessableWords } from "./guessable_words.mjs"
import { answerWords } from "./answer_words.mjs"

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function replaceAtStr(str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

let guessNo = 1;
let guessLetter = 1;

let guess = "";
let answer = answerWords[getRandomInt(answerWords.length)]

let won = false;
let finished = false;

document.addEventListener("keydown", (event) => {
    if (finished)
    {
        return;
    }

    let keyName = event.key;
    let keyCode = event.code;
    // console.log(`Key pressed ${keyName} \r\n Key code value: ${keyCode}`);
    
    if (keyCode == "Enter")
    {
        if (!validateGuess())
        {
            return;
        }
        checkGuess();
        nextGuess();
    }
    else if (keyCode.startsWith("Key"))
    {
        enterLetter(keyName, guessNo, guessLetter);
    }
    else if (keyCode == "Backspace")
    {
        removeLetter(guessNo, guessLetter - 1);
    }
    
}, false);

document.getElementById("play-again").addEventListener("click", () => {
    window.location.reload();
});

function enterLetter(letter, guessNo, letterNo)
{
    if (letterNo > 5)
    {
        return;
    }
    let guessRow = document.getElementById(`guess-${guessNo}`);
    let letterDiv = guessRow.querySelector(`:nth-child(${letterNo})`);
    letterDiv.children[0].textContent = letter.toUpperCase();
    guess += letter;
    guessLetter++;
}

function removeLetter(guessNo, letterNo)
{
    if (letterNo < 1)
    {
        return;
    }
    let guessRow = document.getElementById(`guess-${guessNo}`);
    let letterDiv = guessRow.querySelector(`:nth-child(${letterNo})`);
    letterDiv.children[0].textContent = "";
    guess = guess.slice(0, letterNo - 1);
    guessLetter--;
}

function validateGuess()
{
    if (guess.length < 5 || !guessableWords.includes(guess))
    {
        return false;
    }
    return true;
}

function checkGuess()
{
    let guessRow = document.getElementById(`guess-${guessNo}`);
    let guessLetters = guess;
    let answerLetters = answer;
    for (let i = 0; i < 5; i++)
    {
        let letterDiv = guessRow.querySelector(`:nth-child(${i + 1})`);
        if (guessLetters[i] == answerLetters[i])
        {
            letterDiv.style.backgroundColor = "var(--correctPlaceColor)";
            guessLetters = replaceAtStr(guessLetters, i, "_");
            answerLetters = replaceAtStr(answerLetters, i, "_");
        }
    }
    for (let i = 0; i < 5; i++)
    {
        let letterDiv = guessRow.querySelector(`:nth-child(${i + 1})`);
        if (guessLetters[i] == "_")
        {
            continue;
        }
        else if (answerLetters.includes(guessLetters[i]))
        {
            letterDiv.style.backgroundColor = "var(--incorrectPlaceColor)";
            answerLetters = replaceAtStr(answerLetters, answerLetters.search(guessLetters[i]), "_")
        }
        else
        {
            letterDiv.style.backgroundColor = "var(--notPresentColor)";
        }
    }
    if (guess == answer)
    {
        won = true;
        finishGame();
    }
}

function nextGuess()
{
    guessNo++;
    guessLetter = 1;
    guess = ""
    if (guessNo > 6)
    {
        finishGame();
    }
}

function finishGame()
{
    finished = true;
    let endMessage = document.getElementById("end-message");
    endMessage.style.visibility = "visible";
    if (won)
    {
        endMessage.children[0].textContent = "Pro bhai!";
    }
    else
    {
        endMessage.children[0].textContent = `Noob bhai, ${answer.toUpperCase()} word tha.`;
    }
}