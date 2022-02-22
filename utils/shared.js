const getUuid = require('uuid-by-string');

function parseRoomNameAndGetUuid(name) {
    let lowerCase = name.toLowerCase();

    return getUuid(lowerCase);
}

module.exports = {
    parseRoomNameAndGetUuid
}