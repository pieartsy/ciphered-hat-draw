const results = document.getElementById("results");

//shuffles array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
};


function copyToClipboard(text) {
    const copytext = text
     /* Copy the text inside the text field */
    navigator.clipboard.writeText(copytext);
    /* Alert the copied text */
    alert("Copied the text: " + copytext);
  };

// Creates the encrypted task assignments
function assignTasks() {

    //clears the div for if the list changes
    results.innerHTML = ""

    let names = document.getElementById("names").value;
    let tasks = document.getElementById("tasks").value;

    //Separates all names and tasks between newlines into an array, then turns it into a set to remove repeated elements, then turns it BACK into an array, then filters to remove empty strings (like if someone hit enter too many times).
    let namesList = [...new Set(names.split(/\r?\n/))].filter(Boolean);
    let tasksList = [...new Set(tasks.split(/\r?\n/))].filter(Boolean);

    //Alphabetical order for names
    namesList.sort((a, b) => a.localeCompare(b));
    console.log(namesList);

    //Gets the length of the longest task
    let taskPadding = tasksList.reduce((a, b) => a.length > b.length ? a : b, '');
    taskPadding = taskPadding.length;

    //If the lists are the same length, shuffle the task list (no sense in shuffling both...). Display the names along with the shuffled enciphered text + padding.
    if (namesList.length == tasksList.length) {
        let ciphertext = []
        shuffleArray(tasksList);
        for (let i = 0; i < tasksList.length; i++) {
            ciphertext = encipher(tasksList[i].padEnd(taskPadding, "#"), namesList[i]);
            console.log(ciphertext);
            results.innerHTML += "<button class = 'btn' value = '" + ciphertext + "'> Task for " + namesList[i] + "</button>";
        };
    }
    else {
        results.innerHTML = "The amount of tasks and people isn't the same!";
    }
    };

// Click on Assign button
document.getElementById("assign").addEventListener("click", assignTasks);

buttons = document.getElementsByClassName("btn");

for(var i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click',  function() { copyToClipboard(buttons.value); }, true);
}


// VIGENERE FUNCTIONS https://github.com/leontastic/vigenere.js/blob/master/vigenere.js

    let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,’\'! ';

    // Converts string into array of numbers representing the location of each character in the given character set.
    function mapNumbers(str) {
        let plainMap = new Array();
        for (let i = 0; i < str.length; i++) {
            plainMap[i] = charset.indexOf(str[i]);
        };
        return plainMap;
    };
    
    // Enciphers a given plaintext using a given key
    function encipher(plaintext, key) {
        let cipherText = new Array();
        for (let i = 0; i < plaintext.length; i++) {
            cipherText[i] = charset[(mapNumbers(plaintext)[i] + mapNumbers(key)[i%key.length])%charset.length];
        };
        return cipherText.join("");
    };
    
    // Deciphers a given ciphertext using a given key and displays it in the decipheredtext field. I think the way this is coded, the padding symbol I chose (#) straight up does not show up in the decoded version which is cool.
    function decipher() {
        const key = document.getElementById("key").value;
        const cipheredtasks = document.getElementById("ciphertext").value;
        let decipheredtext = document.getElementById("decipheredtext")
        let plainText = new Array();
        for (let i = 0; i < cipheredtasks.length; i++) {
            plainText[i] = charset[(mapNumbers(ciphertext)[i] - mapNumbers(key)[i%key.length] + charset.length)%charset.length];
        };
        decipheredtext.innerText = plainText.join("");

    };

// Click on Decipher button
document.getElementById("decipher").addEventListener("click", decipher);