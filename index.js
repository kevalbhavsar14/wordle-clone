import { guessableWords } from "./guessable_words.js"
import { answerWords } from "./answer_words.js"

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
    keydown(event.key, event.code);
}, false);

let keys = document.getElementsByClassName("key");
for (let key of keys)
{
    key.addEventListener("click", (event) => {
        keydown(key.children[0].textContent.toLowerCase(), key.attributes["code"].value);
    });
}

document.getElementById("play-again").addEventListener("click", () => {
    window.location.reload();
});

function keydown(keyName, keyCode)
{
    if (finished)
    {
        return;
    }
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
}

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

function sleep(time)
{
    return new Promise((resolve) => setTimeout(resolve, time));
}

function validateGuess()
{
    if (guess.length < 5)
    {
        return false;
    } 
    if (!guessableWords.includes(guess))
    {
        document.getElementById(`guess-${guessNo}`).style.animation = "shake 100ms linear";
        sleep(100).then(() => {
            document.getElementById(`guess-${guessNo}`).style.animation = "";
        })
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
            document.querySelector(`button[code="Key${guessLetters[i].toUpperCase()}"]`).style.backgroundColor = "var(--correctPlaceColor)";
            guessLetters = replaceAtStr(guessLetters, i, "_");
            answerLetters = replaceAtStr(answerLetters, i, "_");
        }
    }
    for (let i = 0; i < 5; i++)
    {
        let letterDiv = guessRow.querySelector(`:nth-child(${i + 1})`);
        let key = document.querySelector(`button[code="Key${guessLetters[i].toUpperCase()}"]`);
        if (guessLetters[i] == "_")
        {
            continue;
        }
        else if (answerLetters.includes(guessLetters[i]))
        {
            letterDiv.style.backgroundColor = "var(--incorrectPlaceColor)";
            if (key.style.backgroundColor != "var(--correctPlaceColor)")
            {
                key.style.backgroundColor = "var(--incorrectPlaceColor)";
            }
            answerLetters = replaceAtStr(answerLetters, answerLetters.search(guessLetters[i]), "_");
        }
        else
        {
            letterDiv.style.backgroundColor = "var(--notPresentColor)";
            if (key.style.backgroundColor != "var(--correctPlaceColor)" && key.style.backgroundColor != "var(--incorrectPlaceColor)")
            {
                key.style.backgroundColor = "var(--notPresentColor)";
            }
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