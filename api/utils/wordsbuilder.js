var fs = require('fs');

const annoyingStopWords = [
    `https`, `youtu`, `wanna`, `kinda`, `hahah`, `loool`,
    `ahaha`, `yours`, `doesn`, `makes`, `looks`, `years`, 
    `comes`, `cones`, `takes`, `knows`, `wants`, `plans`,
    `works`, `feels`, `keeps`, `stays`, `means`, `lives`,
    `masks`, `hours`, `asked`, `times`, `fears`, `fires`,
    `tests`, `calls`, `drops`, `needs`, `saves`, `liked`,
    `hated`, `added`, `rooms`, `lived`, `items`, `wakes`
];

async function buildLingleWords(_fiveletterwords, _roomUuid) {
    let filteredWords = []
    let wordsObjects  = []

    // Build our lingle word population. Using only 5 letter words that aren't the Wordle answers
    let officialWordleAnswers = await fs.promises.readFile('SPOILERS_sorted.txt', 'utf8' , (err, data) => {
        if (err) { console.log(err); }
        return data;
    });
            
    var wordleAnswers = officialWordleAnswers.toString().split("\n");
    for (let word in _fiveletterwords) {
        if (annoyingStopWords.includes(_fiveletterwords[word])) {
            continue
        }

        // If the 5 letter lingo is not in the official wordle answers, include it
        if (!(wordleAnswers.includes(_fiveletterwords[word]))) {
            filteredWords.push(_fiveletterwords[word]);
        }
    }

    // Creates a term frequency map of the words
    let counter = filteredWords.reduce(
        (counter, key) => {
        counter[key] = 1 + counter[key] || 1;
        return counter
    }, {});

    let frequencyMap = new Map(Object.entries(counter).sort((a, b) => b[1] - a[1]));
    frequencyMap.forEach((value, key) => {
        let wordObject = {}
        wordObject["word"] = key;
        wordObject["frequency"] = value;
        wordObject["room_uuid"] = _roomUuid;

        wordsObjects.push(wordObject);
    });
    return wordsObjects;
}

module.exports = {
    buildLingleWords
}