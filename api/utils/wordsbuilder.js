var fs = require('fs');

async function buildLingleWords(_fiveletterwords, _roomUuid) {
    let filteredWords = []
    let wordsObjects  = []

    // Build our lingle word population. Using only 5 letter words that aren't the Wordle answers
    let officialWordleAnswers = await fs.promises.readFile('SPOILERS_sorted.txt', 'utf8' , (err, data) => {
        if (err) { console.log(err); }
        return data;
    });
            
    var wordleAnswers = officialWordleAnswers.toString().split("\n");
    // To ignore the damn URL links and youtube links every gc has
    for (let word in _fiveletterwords) {
        if (_fiveletterwords[word] == `https` || _fiveletterwords[word] == `youtu`) {
            continue
        }

        // If the 5 letter lingo is in the official wordle answers, dont include it
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