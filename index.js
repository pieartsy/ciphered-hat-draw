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
    copynotif.innerHTML = "<i>Copied!</i>";
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

    const tip = document.getElementById("tip")
        link = document.getElementById("link")
        error = document.getElementById("error")
        copy = document.getElementById("copy");

    let names = document.getElementById("names").value;
    let tasks = document.getElementById("tasks").value;

    //Separates all names and tasks between newlines into an array, then turns it into a set to remove repeated elements, then turns it BACK into an array, then filters to remove empty strings (like if someone hit enter too many times).
    let namesList = [...new Set(names.split(/\r?\n/))].filter(Boolean);
    let tasksList = [...new Set(tasks.split(/\r?\n/))].filter(Boolean);

    //Alphabetical order for names
    namesList.sort((a, b) => a.localeCompare(b));

    namesList = namesList.map(name => name.toLowerCase());


    //If the lists are the same length, shuffle the task list (no sense in shuffling both).
    if (namesList.length == tasksList.length) {
        let encipheredtask = [];
        let url = new URL("results.html", window.location);
        shuffleArray(tasksList);
        for (let i = 0; i < tasksList.length; i++) {
            encipheredtask = encipher(tasksList[i], namesList[i]);
            // make a search parameter for the name and task
            url.searchParams.set(namesList[i], encipheredtask);

            // "Send this link to your participants! [initial location].results.html?[name]=[task] - [button saying "Copy result link"]
            // when the button is clicked, "Copied!" appears next to it.
            tip.innerHTML = "Scroll down for the link to send to your participants!";
            link.innerHTML="<a href = " + url + ">" + url + "</a>";
            copy.innerHTML="<button class=\"btn\" onClick=\"copyToClipboard('" + url + "')\">Copy result link</button><span id='copynotif'></span>";  
        };
    }
    else {
        tip.innerHTML = "Make sure there are as many tasks as there are names.";
        link.innerHTML = "";
        copy.innerHTML = "";
    }
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
    
    // Deciphers a given ciphertext using the key from a query and displays it in the decipheredtext field.
function decipher() {
    let key = document.getElementById("key").value;
    //gets rid of whitespace and makes it lowercase
    key = key.trim().toLowerCase();

    //looks for the ciphertext using the search parameters set in assignTasks() and the name the user types in. checks to make sure the name is in the namesList - if it isn't, displays an error/explanation message.
    const query = new URLSearchParams(window.location.search);
    if (query.get(key)) {
        const ciphertext = query.get(key);
    
        let decipheredtext = document.getElementById("decipheredtext");
        let plainText = new Array();

        for (let i = 0; i < ciphertext.length; i++) {
            plainText[i] = charset[(mapNumbers(ciphertext)[i] - mapNumbers(key)[i%key.length] + charset.length)%charset.length];
        };
        decipheredtext.innerText = plainText.join("");
    }
    else {
        decipheredtext.innerText = "That name wasn't in the initial list - are you sure you spelled it right?"
    }

};

// Click on Decipher button
if (document.getElementById("decipher")) {
document.getElementById("decipher").addEventListener("click", decipher);
}