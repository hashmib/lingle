var fs = require('fs');

const annoyingStopWords = [
    `https`, `youtu`, `wanna`, `kinda`, `hahah`, `loool`,
    `ahaha`, `yours`, `doesn`, `makes`, `looks`, `years`, 
    `comes`, `cones`, `takes`, `knows`, `wants`, `plans`,
    `works`, `feels`, `keeps`, `stays`, `means`, `lives`,
    `masks`, `hours`, `asked`, `times`, `fears`, `fires`,
    `tests`, `calls`, `drops`, `needs`, `saves`, `liked`,
    `hated`, `added`, `rooms`, `lived`, `items`, `wakes`,
    `dates`, `didnt`, `plays`, `filed`, `minds`, `shows`,
    `cared`, `cares`, `forms`, `spans`, `sodas`, `faces`,
    `cages`, `pokes`, `poked`, `youve`, `youre`, `homes`,
    `camps`, `items`, `sides`, `added`, `wasnt`, `gates`,
    `tells`, `words`, `parts`, `likes`, `helps`, `cases`,
    `clips`, `foods`, `picks`, `names`, `named`, `gives`,
    `cells`, `hands`, `birds`, `finds`, `ruins`, `seems`,
    `types`, `fixed`, `fixes`, `risks`, `tends`, `loans`,
    `hurts`, `theyd`, `shops`, `falls`, `reads`, `rules`,
    `tries`, `flies`, `tried`, `pulls`, `trans`, `lamps`,
    `swipe`, `ruled`, `turns`, `stars`, `typed`, `wears`,
    `flaws`, `weeks`, `roads`, `acted`, `maids`, `sizes`,
    `flows`, `sends`, `views`, `heres`, `spins`, `walls`,
    `suits`, `pages`, `belts`, `faked`, `waves`, `stops`,
    `backs`, `farms`, `holds`, `weren`, `terms`, `arent`,
    `taxes`, `posts`, `kills`, `hopes`, `hoped`, `costs`
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