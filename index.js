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

// Creates the encrypted task assignments
function assignTasks() {

    const tip = document.getElementById("tip")
        link = document.getElementById("link")
        error = document.getElementById("error")
        copy = document.getElementById("copy")
        discard = document.getElementById("discard");

    let names = document.getElementById("names").value;
    let tasks = document.getElementById("tasks").value;

    //Separates all names and tasks between newlines into an array, then turns it into a set to remove repeated elements, then turns it BACK into an array, then filters to remove empty strings (like if someone hit enter too many times).
    let namesList = [...new Set(names.split(/\r?\n/))].filter(Boolean);
    let tasksList = [...new Set(tasks.split(/\r?\n/))].filter(Boolean);

    if (namesList.length == 0 || tasksList.length == 0) {
        tip.innerHTML = "Make sure the lists aren't empty before you assign.";
        return;
    }

    //Alphabetical order for names
    namesList.sort((a, b) => a.localeCompare(b));

    namesList = namesList.map(name => name.toLowerCase());

    let encipheredtask = "";
    let encipheredname = "";
    let url = new URL("results.html", window.location);

    shuffleArray(tasksList);
    shuffleArray(namesList);

    // object to hold multiple tasks per name if need be
    let namesTasksObj = {};

    // makes all values for each name an array
    for (let i = 0; i < namesList.length; i++) {
        namesTasksObj[namesList[i]] = []
    }

    // loops the inner for loop for as many iterations as there are tasks (counts up within the for loop as well)
    let j = 0;
    parentloop:
    while (j < tasksList.length) {
        for (let i = 0; i < namesList.length; i++) {
            // if there are more names than tasks
            if (namesList.length > tasksList.length) {
                // if you're not discarding extra tasks, repeat tasks to make up the difference, and add to the object
                if (discard.checked == false) {
                    tasksList.push(tasksList[i]);
                    namesTasksObj[namesList[i]].push(tasksList[j])
                }
                // if you are discarding extra tasks and there's no more tasks left, let the namer know they have no task
                else if (!tasksList[i]) {
                    namesTasksObj[namesList[i]].push("Task avoided...for now!")
                }
                // if you are discarding extra tasks but there are still tasks left, continue to distribute them
                else {
                    namesTasksObj[namesList[i]].push(tasksList[j])
                }
            }
            // if there are more tasks than names
            else if (namesList.length < tasksList.length) {
                if (discard.checked == true && !namesList[j]) {
                    break parentloop;
                }
                // if the task has already been assigned to a name (looking through all existing values in the object (which is flattened because the values are arrays)), go to the next iteration of the for loop
                else if (Object.values(namesTasksObj).flat().includes(tasksList[j])) {
                    continue;
                }
                // if not, and there are still enough tasks left over, add to the object. otherwise, break the loop (if you don't check this then it adds an undefined value...)
                else {
                    if (tasksList[j]) {
                        namesTasksObj[namesList[i]].push(tasksList[j])
                    }
                    else {
                        break;
                    }
                }
            }
            //if there's the same amount of tasks as names, add to the object
            else if (namesList.length == tasksList.length) {
                namesTasksObj[namesList[i]].push(tasksList[j])
            }
            
            //if there's more than one task, format it to say "X and Y" as opposed to "X,Y".
            const re = /,\b/ig;
            let formattedTask = namesTasksObj[namesList[i]].toString().replaceAll(re, " and ");
            
            //enciphers the tasks and names and encodes them with LZ compression so that they can include more of the extended ASCII set without being godawfully long
            encipheredtask = LZString.compressToEncodedURIComponent(encipher(formattedTask, namesList[i].trim().toLowerCase()));
            encipheredname = LZString.compressToEncodedURIComponent(encipher(namesList[i].trim().toLowerCase(), namesList[i].trim().toLowerCase()));
            
            // makes a search parameter for the name and task
            url.searchParams.set(encipheredname, encipheredtask);

            //count the while loop up
            j++
        }
    };
    // "Send this link to your participants! [initial location].results.html?[name]=[task] - [button saying "Copy result link"]
    // when the button is clicked, "Copied!" appears next to it.
    tip.innerHTML = "Scroll down for the link to send to your participants!";
    link.innerHTML="<a href = " + url + ">" + url + "</a>";
    copy.innerHTML="<button class=\"btn\" onClick=\"copyToClipboard('" + url + "')\">Copy results link</button><span id='copynotif'></span>";  

}

// Click on Assign button
if (document.getElementById("assign")) {
document.getElementById("assign").addEventListener("click", assignTasks);
}

// Deciphers the query and ciphertext and displays the latter in the decipheredtext field.
function getTasks() {
    let key = document.getElementById("key").value;
    //gets rid of whitespace and makes it lowercase
    key = key.trim().toLowerCase();

    //enciphers the key
    const encipheredkey = LZString.compressToEncodedURIComponent(encipher(key, key));
    //looks for the ciphertext using the enciphered search parameters set in assignTasks(). Checks to make sure that the query exists. if it doesn't, displays an error/explanation message.
    const query = new URLSearchParams(window.location.search);
    if (query.get(encipheredkey)) {
        const ciphertext = query.get(encipheredkey);
        const decipheredtext = document.getElementById("decipheredtext");

        // deciphers the text using the original key (since that's what ciphered it), unencoded from LZ compression
        decipheredtext.innerText = decipher(LZString.decompressFromEncodedURIComponent(ciphertext), key);
    }
    else {
        decipheredtext.innerText = "That name wasn't in the initial list - are you sure you spelled it right?";
    }

};

// Click on Decipher button
if (document.getElementById("decipher")) {
    document.getElementById("decipher").addEventListener("click", getTasks);
}

// VIGENERE FUNCTIONS https://github.com/leontastic/vigenere.js/blob/master/vigenere.js

const charset = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}‘’“”•–—˜™~¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿˀˁ˂˃˄˅ˆˇˈˉˊˋˌˍˎˏːˑ˒˓˔˕˖˗˘˙˚˛˜˝˞˟ͰͱͲͳʹ͵Ͷͷ͸͹ͺͻͼͽ;Ϳ΀΁΂΃΄΅Ά·ΈΉΊ΋Ό΍ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ΢ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώϏϐϑϒϓϔϕϖϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϰϱϲϳϴϵ϶ϷϸϹϺϻϼϽϾϿЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿҀҁ҂҃҄҅҆҇҈҉ҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӁӂӃӄӅӆӇӈӉ      ӉӊӋӌӍӎӏӐӑӒӓӔӕӖӗӘәӚӛӜӝӞӟӠӡӢӣӤӥӦӧӨөӪӫӬӭӮӯӰӱӲӳӴӵӶӷӸӹӺӻӼӽӾӿԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԐԑԒԓԔԕԖԗԘԙԚԛԜԝԞԟԠԡԢԣԤԥԦԧԨԩԪԫԬԭԮԯ԰ԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖ՗՘ՙ՚՛՜՝՞՟ՠաբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքօֆևֈ։֊֋֌֍֎֏ ';

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
    
    
    // Deciphers a given ciphertext using a given key
function decipher(ciphertext, key) {
        let plainText = new Array();
        for (let i = 0; i < ciphertext.length; i++) {
            plainText[i] = charset[(mapNumbers(ciphertext)[i] - mapNumbers(key)[i%key.length] + charset.length)%charset.length];
        }
        return plainText.join("");
};