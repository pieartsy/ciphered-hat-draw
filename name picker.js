const results = document.getElementById("results");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
}

function sendToMap() {
    results.innerHTML = ""
    const names = document.getElementById("names").value;
    const tasks = document.getElementById("tasks").value;
    //Separates all names between commas
    const namesList = [...new Set(names.split(/\r?\n/))];
    let tasksList = [...new Set(tasks.split(/\r?\n/))];
    let taskPadding = tasksList.reduce((a, b) => a.length > b.length ? a : b, '');
    taskPadding = taskPadding.length
    if (namesList.length == tasksList.length) {
        shuffleArray(tasksList);
        for (let i = 0; i < tasksList.length; i++) {
        results.innerHTML += "<b>" + namesList[i] + "</b>: " + encipher(tasksList[i].padEnd(taskPadding, "#"), namesList[i]) + "<br>";
            //results.innerHTML += namesList[i] + "<input type='text' value='" + namesList[i] + "' id='task" + String(i) + "></input>\n"
        };
    }
    else {
        results.innerHTML = "Make sure there's an equal amount of names and tasks!";
    }
    };

// Click on Assign button
document.getElementById("assign").addEventListener("click", sendToMap);

// VIGENERE FUNCTIONS https://github.com/leontastic/vigenere.js/blob/master/vigenere.js

    let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,’\'! ';

    // Converts string into array of numbers representing the location of each character in the given character set.
    function mapNumbers(str) {
        let plainMap = new Array();
        for (let i = 0; i < str.length; i++) {
            plainMap[i] = charset.indexOf(str[i]);
        }
        return plainMap;
    };
    
    // Enciphers a given plaintext using a given key
    function encipher(plaintext, key) {
        let cipherText = new Array();
        for (let i = 0; i < plaintext.length; i++) {
            cipherText[i] = charset[(mapNumbers(plaintext)[i] + mapNumbers(key)[i%key.length])%charset.length];
        }
        return cipherText.join("");
    };
    
    // Deciphers a given ciphertext using a given key
    function decipher() {
        const key = document.getElementById("key").value;
        const ciphertext = document.getElementById("ciphertext").value;
        let decoded = document.getElementById("decoded")
        let plainText = new Array();
        for (let i = 0; i < ciphertext.length; i++) {
            plainText[i] = charset[(mapNumbers(ciphertext)[i] - mapNumbers(key)[i%key.length] + charset.length)%charset.length];
        }
        decoded.innerText = plainText.join("")

    };

document.getElementById("decipher").addEventListener("click", decipher);