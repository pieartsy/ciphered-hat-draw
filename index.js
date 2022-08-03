//shuffles array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
};

//copies encrypted task text to clipboard and prints "copied!" next to it
function copyToClipboard(text) {

    const copynotif = document.getElementById('copynotif');
    const copytext = text.trim();
     /* Copy the text inside the text field */
    navigator.clipboard.writeText(copytext);
    /* Display the copied text */
    copynotif.innerHTML = "<i>- Copied!</i>";
  };

// toggles the view of the task you just copied
function toggle(textid){
    var showtext = document.getElementById(textid);
    if(showtext.style.display === "none"){
        showtext.style.display = "inline-block";
    }else{
        showtext.style.display = "none";
    }
}

// Creates the encrypted task assignments
function assignTasks() {

    const results = document.getElementById("results");

    //clears the div for if the list changes
    results.innerHTML = ""

    let names = document.getElementById("names").value;
    let tasks = document.getElementById("tasks").value;

    //Separates all names and tasks between newlines into an array, then turns it into a set to remove repeated elements, then turns it BACK into an array, then filters to remove empty strings (like if someone hit enter too many times).
    let namesList = [...new Set(names.split(/\r?\n/))].filter(Boolean);
    let tasksList = [...new Set(tasks.split(/\r?\n/))].filter(Boolean);

    //Alphabetical order for names
    namesList.sort((a, b) => a.localeCompare(b));

    namesList = namesList.map(name => name.toLowerCase());

    //Gets the length of the longest task
    let taskPadding = tasksList.reduce((a, b) => a.length > b.length ? a : b, '');
    taskPadding = taskPadding.length;

    //If the lists are the same length, shuffle the task list (no sense in shuffling both).
    if (namesList.length == tasksList.length) {
        let encipheredtask = [];
        let url = new URL("results.html", window.location);
        shuffleArray(tasksList);
        for (let i = 0; i < tasksList.length; i++) {
            encipheredtask = encipher(tasksList[i].padEnd(taskPadding, "#"), namesList[i]);
            // make a search parameter for the name and task
            url.searchParams.set(namesList[i], encipheredtask);
            
            const shortened = fetchAsync("https://is.gd/create.php?format=simple&url=" + url);
            console.log(shortened);

            // "Send this link to your participants! [initial location].results.html?[name]=[task] - [button saying "Copy result link"]
            // when the button is clicked, "Copied!" appears next to it.
            results.innerHTML = "<p>Send this link to your participants!</p><p><a href = " + url + ">" + url + "</a> - <button onClick=\"copyToClipboard('" + url + "')\">Copy result link</button><span id = 'copynotif'></p>"  
        };
    }
    else {
        results.innerHTML = "The amount of tasks and people isn't the same!";
    }
};

// fetch from is.gd
async function fetchAsync (url) {
    let response = await fetch(url);
    console.log(response);
    let data = await response.json();
    return data;
}; 

// Click on Assign button
if (document.getElementById("assign")) {
document.getElementById("assign").addEventListener("click", assignTasks);
}

// VIGENERE FUNCTIONS https://github.com/leontastic/vigenere.js/blob/master/vigenere.js

let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,’-! ';

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
    }
    return cipherText.join("");
};
    
    // Deciphers a given ciphertext using the key from a query and displays it in the decipheredtext field. I think the way this is coded, the padding symbol I chose (#) straight up does not show up in the decoded version which is cool.
function decipher() {
    let key = document.getElementById("key").value;
    //gets rid of whitespace and makes it lowercase
    key = key.trim().toLowerCase();

    //looks for the ciphertext using the search parameters set in assignTasks()
    const query = new URLSearchParams(window.location.search);
    const ciphertext = query.get(key);

    let decipheredtext = document.getElementById("decipheredtext");
    let plainText = new Array();

    for (let i = 0; i < ciphertext.length; i++) {
        plainText[i] = charset[(mapNumbers(ciphertext)[i] - mapNumbers(key)[i%key.length] + charset.length)%charset.length];
    }
    decipheredtext.innerText = plainText.join("");

};

// Click on Decipher button
if (document.getElementById("decipher")) {
document.getElementById("decipher").addEventListener("click", decipher);
}