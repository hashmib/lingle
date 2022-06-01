const getUuid = require('uuid-by-string');

function parseRoomNameAndGetUuid(name) {
    let lowerCase = name.toLowerCase();

    return getUuid(lowerCase);
}

function shuffleList(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

module.exports = {
    parseRoomNameAndGetUuid,
    shuffleList
}