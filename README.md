# Ciphered Hat Draw
A lot of virtual 'draw from a hat' tools are only visible to the one person who has the website open on their own browser. That person also knows what task got picked from the hat and who they're assigning it to.

Instead with this tool, you can pass the hat assignments around without knowing what anyone else is getting (unless you "peek"). You put your names and tasks into the hat, share the link with others, and when they put their name in the results, they get their task. I feel like this aligns better with the reasons people draw from hats in person.
    
It uses [Vigenère Cipher](https://github.com/leontastic/vigenere.js) enciphering and deciphering in lieu of the more complicated stuff. I may change this in the future if I want to include more Unicode because the cipher breaks depending on the character but I have already spent Too Much Time on that aspect (currently it supports Unicode characters up to Latin Extended-B, basic Greek and Slavic, and some punctuation). It also encodes into/decodes from a [compression library](https://pieroxy.net/blog/pages/lz-string/index.html)</a> to avoid being the longest URL ever.</p>

Find the tool here: [tool](https://asterfialla.com/ciphered-hat-draw/)