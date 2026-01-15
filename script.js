const wordInput = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const errorMsg = document.getElementById("error");

const wordEl = document.getElementById("word");
const phoneticEl = document.getElementById("phonetic");
const partOfSpeechEl = document.getElementById("partOfSpeech");
const meaningEl = document.getElementById("meaning");
const exampleEl = document.getElementById("example");
const audioBtn = document.getElementById("audioBtn");

let audio = null;

// Search on button click
searchBtn.addEventListener("click", searchWord);

// Search on Enter key
wordInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = wordInput.value.trim();

    if (word === "") {
        alert("Please enter a word.");
        return;
    }

    errorMsg.textContent = "";
    resultDiv.style.display = "none";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then((data) => {
            displayResult(data[0]);
        })
        .catch(() => {
            errorMsg.textContent = "Word not found. Please try another word.";
        });
}

function displayResult(data) {
    wordEl.textContent = data.word;

    phoneticEl.textContent = data.phonetic || "";

    const meaningData = data.meanings[0];
    partOfSpeechEl.textContent = meaningData.partOfSpeech;

    meaningEl.textContent =
        meaningData.definitions[0].definition;

    exampleEl.textContent =
        meaningData.definitions[0].example ||
        "Example not available";

    // Audio pronunciation
    const phoneticsWithAudio = data.phonetics.find(p => p.audio);
    if (phoneticsWithAudio) {
        audio = new Audio(phoneticsWithAudio.audio);
        audioBtn.style.display = "inline-block";
        audioBtn.onclick = () => audio.play();
    } else {
        audioBtn.style.display = "none";
    }

    resultDiv.style.display = "block";
}
